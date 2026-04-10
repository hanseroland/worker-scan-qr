import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class GetUserCase {
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(id:string, companyId:string): Promise<User>{
        const userExists = await this.userRepository.findById(id, companyId);
        if(!userExists) throw new NotFoundError('User not found');

         return userExists;
        }
}