import { TenantEntity } from './BaseEntity';

export class QRCode extends TenantEntity {
  constructor(
    public readonly id: string,
    companyId: string,
    public readonly locationId: string,
    public code: string,
    public expiresAt: Date,
    public isActive: boolean
  ) {
    super(companyId);
  }
}
