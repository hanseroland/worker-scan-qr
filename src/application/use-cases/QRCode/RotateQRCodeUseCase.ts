// RotateQRCodeUseCase.ts
import { IQRCodeRepository } from '@domain/repositories/IQRCodeRepository';
import { GenerateQRCodeUseCase } from './GenerateQRCodeUseCase';
import { QRCode } from '@domain/entities/QRCode';

export class RotateQRCodeUseCase {
  constructor(private generateQRCodeUseCase: GenerateQRCodeUseCase) {}

  async execute(locationId: string, companyId: string): Promise<QRCode> {
    const newQRCode = await this.generateQRCodeUseCase.execute(
      locationId,
      companyId
    );
    return newQRCode;
  }
}
