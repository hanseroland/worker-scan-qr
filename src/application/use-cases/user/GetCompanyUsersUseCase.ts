import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { SafeUserDTO } from '@shared/types/dto.types';



export class GetCompanyUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    companyId:string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<SafeUserDTO[]> {

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("Access denied!");
    }
    
    const users = await this.userRepository.findAllByCompanyId(companyId);

    if (!users) return [];

    return users.map(user => {
        const { 
          password: _p, 
          activationToken: _at, 
          activationTokenExpires: _ate, 
          resetPasswordToken: _rpt, 
          resetPasswordExpires: _rpe, 
          ...safeUser 
        } = user;
        
        return safeUser as SafeUserDTO;
    });

  }
}
