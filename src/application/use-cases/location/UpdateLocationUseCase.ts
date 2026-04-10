import { Location } from "@domain/entities/Location";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { UpdateLocationDTO } from "@shared/types/dto.types";

export class UpdateLocationUseCase {
    constructor(
        private readonly locationRepository: ILocationRepository
    ){}

    async execute(id:string, companyId:string, dto:UpdateLocationDTO): Promise<Location>{

        // 1. Regarder si l'utilisateur existe
        const locationExists = await this.locationRepository.findById(id, companyId);
        if(!locationExists) throw new NotFoundError('Location not found');

        // 2. Mettre à jour les champs modifiables
        locationExists.name = dto.name ?? locationExists.name;
        locationExists.latitude = dto.latitude ?? locationExists.latitude;
        locationExists.longitude = dto.longitude ?? locationExists.longitude;
        locationExists.radius = dto.radius ?? locationExists.radius;


        // 3. Enregistrer les modifications
        await this.locationRepository.update(locationExists);

        // 4. Retourner l'emplacement mis à jour
        return locationExists;

        
        }
}