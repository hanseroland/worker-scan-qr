import { IUserRepository } from "@domain/repositories/IUserRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class DeleteUserCase {
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(id:string, companyId:string): Promise<void>{
        const userExists = await this.userRepository.findById(id, companyId);
        if(!userExists) throw new NotFoundError('User not found');

        userExists.isActive = false;
        await this.userRepository.update(userExists);
    }
}