import { Employee } from '@domain/entities/Employee';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { IEmailService } from '@domain/services/IEmailService';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { ValidationError } from '@shared/errors/ValidationError';
import { CreateEmployeeDTO } from '@shared/types/dto.types';
import { randomUUID } from 'crypto';

export class CreateEmployeeUseCase {
  constructor(
    private readonly employeeRepository: IEmployeeRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly emailService : IEmailService
  ) {}

  async execute(dto: CreateEmployeeDTO): Promise<void> {
    // 1. Vérifier que la Company existe
    const companyExists = await this.companyRepository.findById(dto.companyId);
    if (!companyExists) {
      throw new NotFoundError('Company not found');
    }

    // 2. Vérifier que l'email n'existe pas déjà dans la company
    const existingEmployee = await this.employeeRepository.findByEmail(
      dto.email
    );
    if (existingEmployee && existingEmployee.companyId === dto.companyId) {
      throw new ValidationError('Email already exists in this company');
    }

    // 3.Générer un employeeCode alphanumérique unique
    let employeeCode: string = '';
    let isUnique = false;
    while (!isUnique) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      employeeCode = Array.from(
        { length: 6 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('');

      const existing = await this.employeeRepository.findByEmployeeCode(
        employeeCode,
        dto.companyId
      );
      if (!existing) isUnique = true;
    }

    // 4. Créer l'entité Employee
    const employee = new Employee(
      randomUUID(), // Générer un ID unique
      dto.companyId,
      null,
      dto.firstName,
      dto.lastName,
      dto.picture || null,
      dto.email,
      dto.phone || null,
      employeeCode,
      true,
      new Date()
    );
    
    try {
       // 5.  Sauvegarder l'employé et retourner
    await this.employeeRepository.save(employee);
    
    await this.emailService.sendEmployeeCode(
            employee.email, 
            employeeCode, 
            companyExists?.name || 'Votre Entreprise'
    );
    } catch (error) {
      console.error("L'employé a été créé mais l'email n'est pas parti", error);
    }
   

  }
}
