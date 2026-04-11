import { Location } from "@domain/entities/Location";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { CreateLocationDTO } from "@shared/types/dto.types";
import { randomUUID } from 'crypto';


export class CreateLocationUseCase {
    constructor(
        private readonly locationRepository: ILocationRepository 
    ){}

    async execute(dto:CreateLocationDTO): Promise<Location>{

        // 1. Créer une nouvelle instance de Location
        const newLocation = new Location(
            randomUUID(), // Générer un ID unique
            dto.companyId,
            dto.name,
            dto.latitude,
            dto.longitude,
            dto.radius
        );

        // 2. Enregistrer la nouvelle location dans le repository
        await this.locationRepository.save(newLocation);

        return newLocation;
    }
}