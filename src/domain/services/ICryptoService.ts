export interface ICryptoService {
  generateActivationToken(): string;
  generateResetPasswordToken(): string;
  generateRandomToken(): string; 
  cryptoHash(data: string): Promise<string>;

}
