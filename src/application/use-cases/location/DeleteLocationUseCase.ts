import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class DeleteLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(
    locationId: string, 
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<void> {
    const locationExist = await this.locationRepository.findById(locationId);
    if (!locationExist) throw new NotFoundError('Location not found');

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === locationExist.companyId;

    if (!isSuperAdmin && !isCompanyAdminOwner) {
      throw new AuthError("You can't delete this zone location, you don't have permission");
    }

    await this.locationRepository.delete(locationId);
  }
}
