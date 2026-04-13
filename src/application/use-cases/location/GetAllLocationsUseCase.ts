import { Location } from '@domain/entities/Location';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';

export class GetAllLocationsUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(companyId: string): Promise<Location[]> {
    const locations =
      await this.locationRepository.findByCompanyLocations(companyId);

    return locations;
  }
}
