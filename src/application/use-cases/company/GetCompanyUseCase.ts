import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class GetCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(
    id: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<Company> {

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === id;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("Access denied, only admin");
    }

    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return company;
  }
}
