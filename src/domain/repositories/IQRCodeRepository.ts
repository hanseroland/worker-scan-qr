import { QRCode } from '@domain/entities/QRCode';
import { IBaseRepository } from './IBaseRepository';

export interface IQRCodeRepository extends IBaseRepository<QRCode> {
  findByCode(code: string): Promise<QRCode | null>;
  findActive(locationId: string): Promise<QRCode[]>;
  deactivateAllByLocation(locationId: string, companyId: string): Promise<void>;
}
