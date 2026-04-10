import { Location } from "@domain/entities/Location";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class GetLocationUseCase {
    constructor(
        private readonly locationRepository: ILocationRepository
    ){}

    async execute(id:string, companyId:string): Promise<Location>{
        const locationExist = await this.locationRepository.findById(id, companyId);
        if(!locationExist) throw new NotFoundError('Location not found');

         return locationExist;
        }
}