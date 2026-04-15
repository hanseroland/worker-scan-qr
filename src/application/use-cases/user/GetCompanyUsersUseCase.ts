import { IUserRepository } from '@domain/repositories/IUserRepository';
import { SafeUserDTO } from '@shared/types/dto.types';



export class GetCompanyUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(companyId:string): Promise<SafeUserDTO[]> {
    const users = await this.userRepository.findAllByCompanyId(companyId);

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
