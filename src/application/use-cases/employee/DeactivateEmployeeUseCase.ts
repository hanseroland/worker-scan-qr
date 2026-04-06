import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class DeactivateEmployeeUseCase {
    
    constructor(private readonly employeeRepository: IEmployeeRepository){}

    async execute(id:string, companyId:string): Promise<void>{
        const employee = await this.employeeRepository.findById(id, companyId);
        if(!employee){
            throw new NotFoundError('Employee not found');
        }
        
        // Désactiver l'employé
        employee.isActive = false;
        await this.employeeRepository.update(employee);
    }

}