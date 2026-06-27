// RotateQRCodeUseCase.ts
import { IQRCodeRepository } from '@domain/repositories/IQRCodeRepository';
import { GenerateQRCodeUseCase } from './GenerateQRCodeUseCase';
import { QRCode } from '@domain/entities/QRCode';
import { UserRole } from '@shared/enums';

export class RotateQRCodeUseCase {
  constructor(private generateQRCodeUseCase: GenerateQRCodeUseCase) {}

  async execute(
    locationId: string, 
    companyId: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null }
  ): Promise<QRCode> {
    const newQRCode = await this.generateQRCodeUseCase.execute(
      locationId,
      companyId,
      requestingUser
    );
    return newQRCode;
  }
}
