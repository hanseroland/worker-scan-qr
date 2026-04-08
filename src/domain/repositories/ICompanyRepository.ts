import { Company } from '@domain/entities/Company';
import { IBaseRepository } from './IBaseRepository';

export interface ICompanyRepository extends IBaseRepository<Company> {
  findByEmail(email: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
}
