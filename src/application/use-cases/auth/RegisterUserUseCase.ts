import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ValidationError } from '@shared/errors/ValidationError';
import { CreateUserDTO } from '@shared/types/dto.types';
import { randomUUID } from 'crypto';
import { ICryptoService } from '@domain/services/ICryptoService';
import { IPasswordService } from '@domain/services/IPasswordService';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private cryptoService: ICryptoService
  ) {}

  async execute(
    dto: CreateUserDTO
  ): Promise<{ user: User; activationToken: string }> {
    // 1. Vérifie si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ValidationError('This user already exists');
    }

    // 2. Hash le mot de passe
    const hashedPassowd = await this.passwordService.hash(dto.password);

    // 3. Génère un token d'activation
    const activationToken = this.cryptoService.generateActivationToken();

    // 4 Hash le token d'activation pour le stocker
    const hashedActivationToken = await this.cryptoService.cryptoHash(activationToken);

    // 5. Créer l'expiration du token d'activation (24h)
    const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 6. Créer l'utilisateur
    const user = new User(
      randomUUID(), // Générer un ID unique
      dto.email,
      hashedPassowd,
      dto.role,
      dto.companyId,
      dto.employeeId,
      false, // isActive
      hashedActivationToken,
      activationTokenExpires,
      null, // resetPasswordToken
      null, // resetPasswordExpires
      new Date()
    );

    // 7. Enregistrer l'utilisateur dans la base de données
    await this.userRepository.save(user);
    return { user, activationToken };
  }
}
