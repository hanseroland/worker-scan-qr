import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class GetCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    return company;
  }
}
