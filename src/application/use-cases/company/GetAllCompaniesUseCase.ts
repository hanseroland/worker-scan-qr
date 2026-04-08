import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';

export class GetAllCompaniesUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(): Promise<Company[]> {
    const comapnies = await this.companyRepository.findAll();
    return comapnies;
  }
}
