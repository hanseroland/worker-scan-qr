import { Employee } from "@domain/entities/Employee";
import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class GetEmployeeUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository){}

    async execute(id:string, companyId:string): Promise<Employee>{
        const employee = await this.employeeRepository.findById(id, companyId);
        if(!employee){
            throw new NotFoundError('Employee not found');
        }
        return employee;
    }

}