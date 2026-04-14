import { IJwtTokenService } from '@domain/services/IJwtTokenService';
import { config } from '@shared/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtTokenService implements IJwtTokenService {
  generateAccessToken(payload: string | Buffer | object): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });
  } 

  generateRefreshToken(payload: string | Buffer | object): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      if (typeof decoded === 'string') {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }
}
