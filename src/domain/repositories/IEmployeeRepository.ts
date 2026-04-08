import { Employee } from '@domain/entities/Employee';
import { IBaseRepository } from './IBaseRepository';

export interface IEmployeeRepository extends IBaseRepository<Employee> {
  findByEmail(email: string): Promise<Employee | null>;
  findByEmployeeCode(code: string, companyId: string): Promise<Employee | null>;
  findAllByCompany(companyId: string): Promise<Employee[]>;
}
