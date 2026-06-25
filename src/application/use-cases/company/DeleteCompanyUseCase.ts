import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class DeleteCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(
    id: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<void> {

    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new AuthError("Access denied; only Admin");
    }

    const comapny = await this.companyRepository.findById(id);
    if (!comapny) {
      throw new NotFoundError('Company not found');
    }
    await this.companyRepository.delete(id);
  }
}
