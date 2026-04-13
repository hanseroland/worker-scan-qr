import { RefreshToken } from '@domain/entities/RefreshToken';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IJwtTokenService } from '@domain/services/IJwtTokenService';
import { AuthError } from '@shared/errors/AuthError';
import { SafeUserDTO } from '@shared/types/dto.types';
import { randomUUID } from 'crypto';
import { ICryptoService } from '@domain/services/ICryptoService';
import { IPasswordService } from '@domain/services/IPasswordService';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private jwtTokenService: IJwtTokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
    private cryptoService: ICryptoService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ user: SafeUserDTO; accessToken: string; refreshToken: string }> {
    // 1. Chercher user par email
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) throw new AuthError('Invalid email or password');

    // 2. Vérifier isActive
    if (!existingUser.isActive) throw new AuthError('Account is not activated');

    // 3. Comparer password
    const isPasswordValid = await this.passwordService.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) throw new AuthError('Invalid password');

    // 4. Générer accessToken
    const accessToken = this.jwtTokenService.generateAccessToken(existingUser);

    // 5. Générer refreshToken
    const refreshToken =
      this.jwtTokenService.generateRefreshToken(existingUser);

    // 6. Hash le refreshToken avant de le stocker
    const hashedRefreshToken =
      await this.cryptoService.cryptoHash(refreshToken);

    // 7. Créer une instance de RefreshToken
    const refreshTokenEntity = new RefreshToken(
      randomUUID(),
      hashedRefreshToken,
      existingUser.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expiration 7 jours
      new Date()
    );

    // 8 . Sauvegarder refreshToken en DB
    await this.refreshTokenRepository.save(refreshTokenEntity);

    // 9. Retourner les tokens
    return {
      user: existingUser,
      accessToken,
      refreshToken,
    };
  }
}
