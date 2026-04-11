import { Location } from '@domain/entities/Location';
import { IBaseRepository } from './IBaseRepository';

export interface ILocationRepository extends IBaseRepository<Location> {
  findByCompanyLocations(companyId: string): Promise<Location[]>;
}