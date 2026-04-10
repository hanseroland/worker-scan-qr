import { Location } from "@domain/entities/Location";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";

export class GetAllUserCase {
    constructor(
        private readonly userRepository: ILocationRepository
    ){}

    async execute(companyId:string): Promise<Location[]>{
        const users = await this.userRepository.findByCompanyLocations(companyId);

         return users;
        }
}