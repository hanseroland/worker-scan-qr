export interface ICryptoService {
  generateActivationToken(): string;
  generateResetPasswordToken(): string;
  generateRandomToken(): string;
  cryptoHash(data: string): string;
  generateOTP(): string;
  generateQRCode(
    locationId: string,
    companyId: string,
    timestamp: number
  ): string;
}
