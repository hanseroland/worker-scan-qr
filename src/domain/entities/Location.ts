import { TenantEntity } from './BaseEntity';

export class Location extends TenantEntity {
  constructor(
    public readonly id: string,
    companyId: string,
    public name: string,
    public latitude: number,
    public longitude: number,
    public radius: number
  ) {
    super(companyId);
  } 
}
 