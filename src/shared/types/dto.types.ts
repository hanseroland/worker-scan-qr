import { Company } from "@domain/entities/Company";
import { Employee } from "@domain/entities/Employee";
import { User } from "@domain/entities/User";

/**
 * DTOs pour Company
 */

//tout sauf id, createdAt, employeeCount
export type CreateCompanyDTO = Omit<Company, 'id' | 'createdAt' | 'employeeCount'>
export type UpdateCompanyDTO = Partial<Omit<Company, 'id' | 'createdAt'>>
export type CompanyResponseDTO = Company


/**
 * DTOs pour Employee
 */
// tout sauf id, createdAt, employeeCode, userId
export type CreateEmployeeDTO = Omit<Employee, 'id' | 'createdAt' | 'employeeCode' | 'userId'>
// firstName, lastName, phone, isActive optionnels
export type UpdateEmployeeDTO = Partial<Omit<Company, 'id' | 'createdAt'>>
// id, firstName, lastName, email, isActive seulement
export type EmployeeListItemDTO = Partial<Omit<Company, 'userId' | 'employeeCode' | 'createdAt'>>
/**
 * DTOs pour User
 */
export type SafeUserDTO = Omit<User, 'password'>
export type CreateUserDTO = Omit<Company, 'id' | 'createdAt'>
