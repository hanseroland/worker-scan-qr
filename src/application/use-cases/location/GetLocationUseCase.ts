import { Location } from '@domain/entities/Location';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class GetLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(
    id: string, 
    requestingUser: { id: string; role: UserRole; companyId: string | null }

  ): Promise<Location> {


    const locationExist = await this.locationRepository.findById(id);
    if (!locationExist) throw new NotFoundError('Location not found');

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    
    // Pour CompanyAdmin et Employee, ils doivent obligatoirement appartenir au même companyId que la zone ciblée
    const hasCompanyAccess = requestingUser.companyId === locationExist.companyId;

    if (!isSuperAdmin && !hasCompanyAccess) {
      throw new AuthError("You don't have permission to read this location.");
    }

    return locationExist;
  }
}
