import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";

export class GetAllUserCase {
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(companyId:string): Promise<User[]>{
        const users = await this.userRepository.findAllByCompanyId(companyId);

         return users;
        }
}