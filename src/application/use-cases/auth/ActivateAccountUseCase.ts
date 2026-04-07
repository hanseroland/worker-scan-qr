import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IHashService } from "@domain/services/IHashService";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";

// Retourne : User
export class ActivationAccountUseCase {
     constructor(
        private userRepository: IUserRepository,
        private hashService: IHashService
     ){}

     async execute(token:string){
        // 1. Hash le token reçu
        const hashedToken = await this.hashService.hash(token);

        // 2. Chercher user par activationToken hashé
        const existingUser = await this.userRepository.findByActivationToken(hashedToken);
        if (!existingUser) throw new NotFoundError("Invalid Token");

        // 3. Vérifier que le token n'est pas expiré
        if (existingUser.activationTokenExpires &&  existingUser.activationTokenExpires < new Date())
            throw new AuthError("Activation token has expired");
    
        // 4. Activer le compte → isActive: true
        existingUser.isActive = true;

        // 5. Effacer activationToken et activationTokenExpires
        existingUser.activationToken = null;
        existingUser.activationTokenExpires = null;

        // 6. Enregistrer les changements dans la base de données
        await this.userRepository.update(existingUser);

        return existingUser;


    }
}