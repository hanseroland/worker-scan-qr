import { Location } from '@domain/entities/Location';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';

export class GetAllLocationsUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(
    companyId: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<Location[]> {

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("You can't read only your company locations");
    }

    const locations = await this.locationRepository.findByCompanyLocations(companyId);

    return locations;
  }
}
