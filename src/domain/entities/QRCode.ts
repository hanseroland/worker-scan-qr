import { TenantEntity } from './BaseEntity';

export class QRCode extends TenantEntity {
  constructor(
    companyId: string,
    public readonly id: string,
    public readonly locationId: string,
    public code: string,
    public expiresAt: Date,
    public isActive: boolean
  ) {
    super(companyId);
  }
}
