import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { SafeEmployeeDTO } from '@shared/types/dto.types';

export class GetAllEmployeesUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(
    companyId: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<SafeEmployeeDTO[]> {

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("Access denied");
    }

    const employees = await this.employeeRepository.findAllByCompany(companyId);
    return employees.map(employee => {
            const { 
              userId: _us, 
              employeeCode: _em, 
              ...safeEmployee 
            } = employee;
            
            return safeEmployee as SafeEmployeeDTO;
      });
  }


}
