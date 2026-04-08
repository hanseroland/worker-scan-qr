import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { UpdateCompanyDTO } from '@shared/types/dto.types';

export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(id: string, dto: UpdateCompanyDTO): Promise<Company> {
    // 1. Vérifier si l'email existe déjà
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new NotFoundError('Company not found');
    }

    // 2. Modifier l'entité avec les champs système
    const company = new Company(
      existingCompany.id,
      dto.name || existingCompany.name,
      dto.email || existingCompany.email,
      dto.phone !== undefined ? dto.phone : existingCompany.phone,
      dto.logo !== undefined ? dto.logo : existingCompany.logo,
      dto.isActive !== undefined ? dto.isActive : existingCompany.isActive,
      existingCompany.createdAt,
      existingCompany.employeeCount
    );
    // 3. Sauvegarder et retourner
    await this.companyRepository.update(company);
    return company;
  }
}
