import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class DesactivateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(
    id: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<void> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === employee.companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("Youn have not rules to delete this employee");
    }

    // Désactiver l'employé
    employee.isActive = false;
    await this.employeeRepository.update(employee);
  }
}
