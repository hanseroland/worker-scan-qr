import { User } from '@domain/entities/User';
import { IBaseRepository } from './IBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByEmployeeId(employeeId: string): Promise<User | null>;
  findByActivationToken(hashedToken: string): Promise<User | null>;
  findByResetPasswordToken(hashedToken: string): Promise<User | null>;
}
