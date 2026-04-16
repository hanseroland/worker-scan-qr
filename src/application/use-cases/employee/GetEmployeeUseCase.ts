import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { SafeEmployeeDTO } from '@shared/types/dto.types';

export class GetEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string, companyId: string): Promise<SafeEmployeeDTO> {
    const employee = await this.employeeRepository.findById(id, companyId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const { 
            userId: _us, 
            employeeCode: _emp, 
            ...safeEmployee
    } = employee;
    return safeEmployee as SafeEmployeeDTO;
  }
}
