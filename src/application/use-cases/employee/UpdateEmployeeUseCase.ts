import { Employee } from '@domain/entities/Employee';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { UpdateEmployeeDTO } from '@shared/types/dto.types';

export class UpdateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(
    id: string,
    companyId: string,
    dto: UpdateEmployeeDTO
  ): Promise<Employee> {
    // 1. Vérifier si l'employé existe déjà
    const existingEmployee = await this.employeeRepository.findById(
      id,
      companyId
    );
    if (!existingEmployee) {
      throw new NotFoundError('Employee not found');
    }

    // 2. Modifier l'entité avec les champs système
    const employee = new Employee(
      existingEmployee.id,
      existingEmployee.companyId,
      dto.userId !== undefined ? dto.userId : existingEmployee.userId,
      dto.firstName || existingEmployee.firstName,
      dto.lastName || existingEmployee.lastName,
      dto.picture !== undefined ? dto.picture : existingEmployee.picture,
      dto.email || existingEmployee.email,
      dto.phone !== undefined ? dto.phone : existingEmployee.phone,
      existingEmployee.employeeCode,
      dto.isActive !== undefined ? dto.isActive : existingEmployee.isActive,
      existingEmployee.createdAt
    );
    // 3. Sauvegarder et retourner
    await this.employeeRepository.update(employee);
    return employee;
  }
}
