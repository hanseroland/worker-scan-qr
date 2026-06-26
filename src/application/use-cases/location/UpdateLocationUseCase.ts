import { Location } from '@domain/entities/Location';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { UpdateLocationDTO } from '@shared/types/dto.types';

export class UpdateLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(
    id: string,
    dto: UpdateLocationDTO,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<Location> {
    // 1. Regarder si l'utilisateur existe
    const locationExists = await this.locationRepository.findById(id);
    if (!locationExists) throw new NotFoundError('Location not found');

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === locationExists.companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("You haven't permission to update this location");
    }

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
