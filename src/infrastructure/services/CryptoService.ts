import { ICryptoService } from "@domain/services/ICryptoService";
import crypto from 'crypto';

export class CryptoService implements ICryptoService {

    generateActivationToken(): string {
        return crypto.randomBytes(32).toString("hex");
    }

    cryptoHash(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');

     }

    generateResetPasswordToken(): string {
        return crypto.randomBytes(32).toString("hex");
        
    }

    generateRandomToken(): string {
        return crypto.randomBytes(32).toString("hex");
    }

}
