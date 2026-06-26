import { Location } from '@domain/entities/Location';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { CreateLocationDTO } from '@shared/types/dto.types';
import { randomUUID } from 'crypto';

export class CreateLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  async execute(
    dto: CreateLocationDTO,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<Location> {


    const isCompanyAdmin = requestingUser.role === UserRole.COMPANY_ADMIN;

    //  Un CompanyAdmin ne peut créer une zone que pour sa propre boîte
    if (isCompanyAdmin && requestingUser.companyId !== dto.companyId) {
      throw new AuthError("You can create zone location only for your company");
    }

    // 1. Créer une nouvelle instance de Location
    const newLocation = new Location(
      randomUUID(), // Générer un ID unique
      dto.companyId,
      dto.name,
      dto.latitude,
      dto.longitude,
      dto.radius
    );

    // 2. Enregistrer la nouvelle location dans le repository
    await this.locationRepository.save(newLocation);

    return newLocation;
  }
}
