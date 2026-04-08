import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class DeleteCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(id: string): Promise<void> {
    const comapny = await this.companyRepository.findById(id);
    if (!comapny) {
      throw new NotFoundError('Company not found');
    }
    await this.companyRepository.delete(id);
  }
}
