import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { IQRCodeRepository } from '@domain/repositories/IQRCodeRepository';
import { GeoLocation } from '@domain/value-objects/GeoLocation';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { ValidationError } from '@shared/errors/ValidationError';

export class ValidateQRCodeUseCase {
  constructor(
    private readonly qrCodeRepository: IQRCodeRepository,
    private readonly locationRepository: ILocationRepository
  ) {}

  async execute(
    code: string,
    latitude: number,
    longitude: number,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<boolean> {
    // 1. Chercher QR Code par code
    const qrCode = await this.qrCodeRepository.findByCode(code);
    if (!qrCode) throw new NotFoundError('QR Code not found');

    // 2. Barrière Multi-Tenant : l'utilisateur appartient-il au même tenant que le QR Code ?
    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    if (!isSuperAdmin && requestingUser.companyId !== qrCode.companyId) {
      throw new AuthError("It's another company's code. Access denied.");
    }

    // 3. Vérifier isActive + expiresAt
    if (!qrCode.isActive || qrCode.expiresAt < new Date()) {
      throw new ValidationError('QR Code has expired or is inactive');
    }

    // 4. Chercher la Location liée
    const location = await this.locationRepository.findById(qrCode.locationId);
    if (!location) throw new NotFoundError('Associated location not found');

    // 5. Vérifier géolocalisation avec GeoLocation value object
    const employeeLocation = new GeoLocation(latitude, longitude);
    const locationCenter = new GeoLocation(
      location.latitude,
      location.longitude
    );
    const isWithinRadius = employeeLocation.isWithinRadius(
      locationCenter,
      location.radius
    );

    if (!isWithinRadius) {
      throw new ValidationError('Employee is not within the location radius');
    }

    return true; // QR Code is valid
  }
}
