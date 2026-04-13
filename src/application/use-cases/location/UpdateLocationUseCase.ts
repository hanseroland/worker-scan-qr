import { Location } from '@domain/entities/Location';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { UpdateLocationDTO } from '@shared/types/dto.types';

export class UpdateLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(
    id: string,
    companyId: string,
    dto: UpdateLocationDTO
  ): Promise<Location> {
    // 1. Regarder si l'utilisateur existe
    const locationExists = await this.locationRepository.findById(
      id,
      companyId
    );
    if (!locationExists) throw new NotFoundError('Location not found');

    // 2. Mettre à jour les champs modifiables
    const updatedLocation = new Location(
      locationExists.id,
      locationExists.companyId,
      dto.name ?? locationExists.name,
      dto.latitude ?? locationExists.latitude,
      dto.longitude ?? locationExists.longitude,
      dto.radius ?? locationExists.radius
    );
    await this.locationRepository.update(updatedLocation);
    return updatedLocation;
  }
}
