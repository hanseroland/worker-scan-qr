import { ICryptoService } from "@domain/services/ICryptoService";
import { config } from "@shared/config";
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

    generateOTP(): string {
        // 6 chiffres numériques
        const otp = crypto.randomInt(100000, 999999).toString();
        return otp;
    }

    generateQRcode(locationId: string, companyId: string, timestamp: number): string {
    return crypto
        .createHmac('sha256', config.qrcode.qr_secret || 'qr_secret')
        .update(`${locationId}:${companyId}:${timestamp}`)
        .digest('hex')
        .substring(0, 32)
    }

}
