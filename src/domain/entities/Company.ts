import { Entity } from '@shared/decorators';

@Entity('companies')
export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly email: string,
    public phone: string | null,
    public logo: string | null,
    public isActive: boolean,
    public readonly createdAt: Date,
    public employeeCount: number
  ) {}
}
