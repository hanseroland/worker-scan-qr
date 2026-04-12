import { PointageEvent } from "@domain/entities/PointageEvent";
import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { IPointageEventRepository } from "@domain/repositories/IPointageEventRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class GetPointageEventsByEmployeeUseCase {
    constructor(
                private readonly pointageEventRepository: IPointageEventRepository,
                private readonly employeeRepository: IEmployeeRepository,
                
    ){}

   async execute(employeeId: string, companyId: string): Promise<PointageEvent[]>{
        // 1. Vérifier que l'employé existe
         const employeeExists = await this.employeeRepository.findById(employeeId,companyId);
        if(!employeeExists) throw new NotFoundError('Employee not found');

        // 2. Récupérer tous les événements de pointage
        const pointageEvents = await this.pointageEventRepository.findByEmployeeId(employeeId,companyId)
        // Retourne : PointageEvent[]
        return pointageEvents;
   }
}