import { IBaseRepository } from './IBaseRepository';
import { EmployeeInvitation } from '@domain/entities/EmployeeInvitation';

export interface IEmployeeInvitationRepository extends IBaseRepository<EmployeeInvitation> {
  findByToken(token: string): Promise<EmployeeInvitation | null>;
  findByEmployeeId(employeeId: string): Promise<EmployeeInvitation[]>;
  findLatestEmployeeInvitations(
    employeeId: string
  ): Promise<EmployeeInvitation | null>;
}
