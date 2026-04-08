import { Employee } from '@domain/entities/Employee';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';

export class GetAllEmployeesUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(companyId: string): Promise<Employee[]> {
    const employees = await this.employeeRepository.findAllByCompany(companyId);
    return employees;
  }
}
