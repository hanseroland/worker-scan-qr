import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IHashService } from "@domain/services/IHashService";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class ResetPasswordUseCase{
        constructor(
            private userRepository: IUserRepository,
            private hashService: IHashService
        ){}

        async execute(token: string, newPassword:string): Promise<void>{

            // 1. hash le token reçu
            const hashedToken = await this.hashService.hash(token);

            // 2. Chercher user par resetPasswordToken hashé
            const user = await this.userRepository.findByResetPasswordToken(hashedToken);
            if (!user) throw new NotFoundError("Invalid or expired reset token");
            

            // 3. Vérifier expiration
            if (user.resetPasswordExpires && user.resetPasswordExpires.getTime() < Date.now())
                throw new AuthError("Reset token has expired");

            // 4. Hasher nouveau password
            const hashedPassword = await this.hashService.hash(newPassword);
            user.password = hashedPassword;

            // 5. Effacer resetPasswordToken et resetPasswordExpires
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await this.userRepository.update(user);
            
        }
}
