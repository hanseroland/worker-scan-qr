import { QRCode } from '@domain/entities/QRCode';
import { ILocationRepository } from '@domain/repositories/ILocationRepository';
import { IQRCodeRepository } from '@domain/repositories/IQRCodeRepository';
import { ICryptoService } from '@domain/services/ICryptoService';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { randomUUID } from 'crypto';

export class GenerateQRCodeUseCase {
  constructor(
    private readonly qrCodeRepository: IQRCodeRepository,
    private readonly locationRepository: ILocationRepository,
    private readonly cryptoService: ICryptoService
  ) {}

  async execute(
    locationId: string, 
    companyId: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<QRCode> {

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdmin = requestingUser.role === UserRole.COMPANY_ADMIN;

    // 1. Validation de la Matrice de Permissions
    if (isCompanyAdmin && requestingUser.companyId !== companyId) {
      throw new AuthError("You can't generate QR code");
    }

    // 2. Vérifier que le lieux existe et appartient à l'entreprise
    const existingLocation = await this.locationRepository.findById(locationId);
    if (!existingLocation || existingLocation.companyId !== companyId) {
      throw new NotFoundError('Location not found in this company');
    }

    // 3. Désactiver les QR codes actifs pour ce lieu
    await this.qrCodeRepository.deactivateAllByLocation(locationId, companyId);

    // 4. Générer un nouveau QR code avec cryptoService.generateQRCode()
    const newQRCode = this.cryptoService.generateQRCode(
      locationId,
      companyId,
      Date.now()
    );

    // 4. expiresAt = now + config.qrcode.rotationInterval 30 secondes
    const expiresAt = new Date(Date.now() + 30 * 1000); // 30 secondes

    // 5. // 5. Sauvegarder et retourner
    const qrCodeEntity = new QRCode(
      randomUUID(),
      companyId,
      locationId,
      newQRCode,
      expiresAt,
      true
    );

    await this.qrCodeRepository.save(qrCodeEntity);

    return qrCodeEntity;
  }
}
