import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { SafeEmployeeDTO } from '@shared/types/dto.types';

export class GetEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(
    id: string, 
    requestingUser: { id: string; role: UserRole; companyId: string | null; employeeId: string | null }
  ): Promise<SafeEmployeeDTO> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === employee.companyId;
    const isSelf = requestingUser.role === UserRole.EMPLOYEE && requestingUser.employeeId === id;

    if (!isSuperAdmin && !isCompanyAdminOwner && !isSelf) {
      throw new AuthError("Access denied.");
    }

    const { 
            userId: _us, 
            employeeCode: _emp, 
            ...safeEmployee
    } = employee;
    return safeEmployee as SafeEmployeeDTO;
  }
}
