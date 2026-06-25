import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';

export class GetAllCompaniesUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(requestingUser: { id: string; role: UserRole; companyId: string | null }): Promise<Company[]> {

    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new AuthError("Access denied, only SUPER ADMIN");
    }

    const companies = await this.companyRepository.findAll();
    return companies;
  }
}
