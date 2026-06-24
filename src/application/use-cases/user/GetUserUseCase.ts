import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRole } from "@shared/enums";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { SafeUserDTO } from "@shared/types/dto.types";

export class GetUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(
        id:string, 
        requestingUser: { id: string; role: UserRole; companyId: string | null }
    ): Promise<SafeUserDTO>{

        const userExists = await this.userRepository.findById(id);
        if(!userExists) throw new NotFoundError('User not found');

        
        const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
        const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === userExists.companyId;
        const isSelf = requestingUser.id === id;

        if (!isSuperAdmin && !isCompanyAdminOwner && !isSelf) {
            throw new AuthError("Access denied!");
        }

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