import { Employee } from '@domain/entities/Employee';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { SafeEmployeeDTO, UpdateEmployeeDTO } from '@shared/types/dto.types';

export class UpdateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(
    id: string,
    dto: UpdateEmployeeDTO,
    requestingUser: { id: string; role: UserRole; companyId: string | null, employeeId: string | null }
  ): Promise<SafeEmployeeDTO> {
    // 1. Vérifier si l'employé existe déjà
    const existingEmployee = await this.employeeRepository.findById(id);

    if (!existingEmployee) {
      throw new NotFoundError('Employee not found');
    }

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === existingEmployee.companyId;
    const isSelf = requestingUser.role === UserRole.EMPLOYEE && requestingUser.employeeId === id;

    // 2. Droit d'accès global
    if (!isSuperAdmin && !isCompanyAdminOwner && !isSelf) {
      throw new AuthError("You don't have permission to udpate this employee");
    }

    // 2. Protection des champs critiques (Si c'est l'employé lui-même qui modifie)
    if (isSelf && !isSuperAdmin && !isCompanyAdminOwner) {
      if (dto.isActive !== undefined || dto.userId !== undefined) {
        throw new AuthError("As employee, you can't update your activated status or link to a user.");
      }
    }

    // 3. Modifier l'entité avec les champs système
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
    // 4. Sauvegarder et retourner
    await this.employeeRepository.update(employee);
    
     const { 
            userId: _us, 
            employeeCode: _emp, 
            ...safeEmployee
    } = employee;
    return safeEmployee as SafeEmployeeDTO;
  }
}
