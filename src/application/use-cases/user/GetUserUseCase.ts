import { IUserRepository } from "@domain/repositories/IUserRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { SafeUserDTO } from "@shared/types/dto.types";

export class GetUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(id:string, companyId?:string): Promise<SafeUserDTO>{
        const userExists = await this.userRepository.findById(id, companyId);
        if(!userExists) throw new NotFoundError('User not found');

        const { 
            password: _p, 
            activationToken: _at, 
            activationTokenExpires: _ate, 
            resetPasswordToken: _rpt, 
            resetPasswordExpires: _rpe, 
            ...safeUser 
        } = userExists;
        
        return safeUser as SafeUserDTO;
    }
}