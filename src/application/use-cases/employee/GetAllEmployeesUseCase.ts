import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { SafeEmployeeDTO } from '@shared/types/dto.types';

export class GetAllEmployeesUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(companyId: string): Promise<SafeEmployeeDTO[]> {
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
