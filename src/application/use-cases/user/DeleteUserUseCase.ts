import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    id: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<void> {

    const userExists = await this.userRepository.findById(id);
    if (!userExists) throw new NotFoundError('User not found');

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === userExists.companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("You can't do this operation.");
    }

    userExists.isActive = false;
    await this.userRepository.update(userExists);
  }
}
