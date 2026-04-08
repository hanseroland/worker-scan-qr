import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ICryptoService } from '@domain/services/ICryptoService';
import { IJwtTokenService } from '@domain/services/IJwtTokenService';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private userRepository: IUserRepository,
    private cryptoService: ICryptoService,
    private jwtTokenService: IJwtTokenService
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    // 1. hash le refreshToken reçu
    const hashedToken = await this.cryptoService.cryptoHash(refreshToken);
    const storedToken =
      await this.refreshTokenRepository.findByToken(hashedToken);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AuthError('Invalid or expired refresh token');
    }

    //  2. Chercher l'utilisateur associé au token
    const user = await this.userRepository.findById(storedToken.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 3. Générer un nouveau accessToken
    const accessToken = this.jwtTokenService.generateAccessToken(user);

    return { accessToken };
  }
}
