import { Employee } from "@domain/entities/Employee"

export interface IEmployeeRepository {
    findById(id: string, companyId: string): Promise<Employee | null>
    findByEmail(email: string): Promise<Employee | null>
    findByEmployeeCode(employeeCode: string): Promise<Employee | null>
    findAllByCompany(companyId: string): Promise<Employee[]>
    save(employee: Employee): Promise<void>
    update(employee: Employee): Promise<void>
    delete(id: string, companyId: string): Promise<void>
}