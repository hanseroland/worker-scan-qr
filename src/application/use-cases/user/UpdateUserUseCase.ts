import { IUserRepository } from '@domain/repositories/IUserRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { SafeUserDTO, UpdateUserDTO } from '@shared/types/dto.types';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDTO, companyId?: string): Promise<SafeUserDTO> {
    // 1. Regarder si l'utilisateur existe
    const userExists = await this.userRepository.findById(id,companyId);
    if (!userExists) throw new NotFoundError('User not found');

    // 2. Mettre à jour les champs modifiables
    if (dto.role !== undefined) userExists.role = dto.role;
    if (dto.isActive !== undefined) userExists.isActive = dto.isActive;

    // 3. Enregistrer les modifications
    await this.userRepository.update(userExists);

    // 4. Destructure de userExists
    const { 
      password: _p, 
      activationToken: _at, 
      activationTokenExpires: _ate, 
      resetPasswordToken: _rpt, 
      resetPasswordExpires: _rpe, 
      ...safeUser 
    } = userExists;

    // 5. Retourner l'utilisateur mis à jour
    return safeUser as SafeUserDTO;
  }
}
