import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ICryptoService } from '@domain/services/ICryptoService';
import { IEmailService } from '@domain/services/IEmailService';

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private cryptoService: ICryptoService,
    private emailService : IEmailService
  ) {}

  async execute(email: string): Promise<void> {
    // 1. Chercher user
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      // Ne pas révéler que l'email n'existe pas pour des raisons de sécurité
      return;
    }

    // 2. Générer resetPasswordToken
    const resetToken = this.cryptoService.generateRandomToken();

    // 3. Hash et sauvegarder + expiration 1h
    const hashedResetToken = await this.cryptoService.cryptoHash(resetToken);
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1h

    existingUser.resetPasswordToken = hashedResetToken;
    existingUser.resetPasswordExpires = new Date(resetTokenExpires);

    // 4. Mise à jour des données
    await this.userRepository.update(existingUser);

    // 5. Envoie de l'email avec le token en clair
    this.emailService.sendResetPasswordEmail(email, resetToken).catch(err => {
        console.error(`Erreur envoi email reset à ${email}:`, err);
    });
  }
}
