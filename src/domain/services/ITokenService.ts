export interface ITokenService {
  generateAccessToken(payload: object): string
  generateRefreshToken(payload: object): string
  generateActivationToken(): string        // crypto random token
  generateResetPasswordToken(): string     // crypto random token
  verifyAccessToken(token: string): object | null
}

 