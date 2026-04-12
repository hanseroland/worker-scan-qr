import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { IPointageEventRepository } from "@domain/repositories/IPointageEventRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { CreatePointageEventDTO } from "@shared/types/dto.types";
import { randomUUID } from "crypto";
import { ValidateQRCodeUseCase } from "../QRCode/ValidateQRCodeUseCase";
import { PointageEvent } from "@domain/entities/PointageEvent";
import { PointageType } from "@shared/enums"
import { ValidationError } from "@shared/errors/ValidationError";


export class CreatePointageEventUseCase {
    constructor(
        private readonly pointageEventRepository: IPointageEventRepository,
        private readonly employeeRepository: IEmployeeRepository,
        private readonly validateQRCodeUseCase: ValidateQRCodeUseCase

    ){}


   async execute(dto: CreatePointageEventDTO): Promise<PointageEvent> {
        // 1. Vérifier que l'employé existe
        const employeeExists = await this.employeeRepository.findById(dto.employeeId,dto.companyId);
        if(!employeeExists) throw new NotFoundError('Employee not found');

        // 2. Valider le QR Code + géolocalisation via ValidateQRCodeUseCase
        await this.validateQRCodeUseCase.execute(
            dto.qrCode,
            dto.latitude,
            dto.longitude,
            dto.companyId,
        )
        
        // 3. Vérifier l'ordre des événements (CHECK_IN avant CHECK_OUT etc.)
        const lastEvent = await this.pointageEventRepository.findLastByEmployee(
            dto.employeeId,
            dto.companyId
        )

        const type = this.determinePointageType(lastEvent?.type);

        // 4. Créer l'entité PointageEvent
        const pointageEvent = new PointageEvent(
            randomUUID(),
            dto.companyId,
            dto.employeeId,
            type,
            new Date(),
            dto.latitude,
            dto.longitude,
            true 
        )

        // 5. Sauvegarder et retourner
        await this.pointageEventRepository.save(pointageEvent);
        return pointageEvent;
     }
     

     private determinePointageType(lastType?: PointageType): PointageType {
       
        if(!lastType) return PointageType.CHECK_IN;

        switch(lastType) {
            case PointageType.CHECK_IN:
                return PointageType.CHECK_OUT;
            case PointageType.BREAK_START:
                return PointageType.BREAK_END;
            case PointageType.BREAK_END:
                return PointageType.CHECK_OUT;
            case PointageType.CHECK_OUT:
                throw new ValidationError('Shift already completed for today');
            default:
                throw new NotFoundError('Invalid last pointage type');
        }
    }

    
}