import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class DeleteLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(locationId: string, companyId: string): Promise<void> {
    const locationExist = await this.locationRepository.findById(
      locationId,
      companyId
    );
    if (!locationExist) throw new NotFoundError('Location not found');

    await this.locationRepository.delete(locationId, companyId);
  }
}
