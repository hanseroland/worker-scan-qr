import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IHashService } from "@domain/services/IHashService";

export class ForgotPasswordUseCase {
    constructor(
        private userRepository: IUserRepository,
        private hashService: IHashService

    ){}

    async execute(email: string): Promise<{ resetToken: string }>{
        
        // 1. Chercher user
        const existingUser = await this.userRepository.findByEmail(email);
        if (!existingUser) {
            // Ne pas révéler que l'email n'existe pas pour des raisons de sécurité
            return { resetToken: "" };
        }
 
        // 2. Générer resetPasswordToken
        const resetToken = this.hashService.generateRandomToken();

        // 3. Hash et sauvegarder + expiration 1h
        const hashedResetToken = await this.hashService.hash(resetToken);
        const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1h

        existingUser.resetPasswordToken = hashedResetToken;
        existingUser.resetPasswordExpires = new Date(resetTokenExpires);

        await this.userRepository.update(existingUser);

        return { resetToken };

    }
}