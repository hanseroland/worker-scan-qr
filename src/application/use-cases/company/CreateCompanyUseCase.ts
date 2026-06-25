import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { ValidationError } from '@shared/errors/ValidationError';
import { CreateCompanyDTO } from '@shared/types/dto.types';
import { randomUUID } from 'crypto';

export class CreateCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(
    dto: CreateCompanyDTO,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<Company> {

    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new AuthError("Access denied! Only admin");
    }

    // 1. Vérifier si l'email existe déjà
    const existingCompany = await this.companyRepository.findByEmail(dto.email);
    if (existingCompany) {
      throw new ValidationError('Email already exists');
    }
    // 2. Créer l'entité avec les champs système
    const company = new Company(
      randomUUID(), // Générer un ID unique
      dto.name,
      dto.email,
      dto.phone || null,
      dto.logo || null,
      true,
      new Date(),
      0
    );
    // 3. Sauvegarder et retourner
    await this.companyRepository.save(company);
    return company;
  }
}
