import { EmployeeInvitation } from '@domain/entities/EmployeeInvitation';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { IEmployeeInvitationRepository } from '@domain/repositories/IEmployeeInvitationRepository';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { ICryptoService } from '@domain/services/ICryptoService';
import { IEmailService } from '@domain/services/IEmailService';
import { InvitationStatus, InvitationType, UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { ValidationError } from '@shared/errors/ValidationError';
import { CreateEmployeeInvitationDTO } from '@shared/types/dto.types';
import { randomUUID } from 'crypto';

export class CreateInvitationUseCase {
  constructor(
    private invitationRepository: IEmployeeInvitationRepository,
    private employeeRepository: IEmployeeRepository,
    private cryptoService: ICryptoService,
    private emailService: IEmailService,
    private companyRepository: ICompanyRepository
  ) {}

  async execute(
    dto: CreateEmployeeInvitationDTO,
    requestingUser: { id: string; role: UserRole; companyId: string | null }

  ): Promise<void> {

    const isCompanyAdmin = requestingUser.role === UserRole.COMPANY_ADMIN;

    // 1. Validation de la Matrice de Permissions
    if (isCompanyAdmin && requestingUser.companyId !== dto.companyId) {
      throw new AuthError("You can only create invitation for your company.");
    }

    // 2. Vérifier que la Company existe
    const companyExists = await this.companyRepository.findById(dto.companyId);
    if (!companyExists) throw new NotFoundError('Company not found');

    //3. Vérifier que l'employé existe
    const employeeExists = await this.employeeRepository.findById(dto.employeeId);
    if (!employeeExists) throw new NotFoundError('Employee not found');

   // Sécurité supplémentaire : s'assurer que l'employé ciblé appartient bien à la compagnie soumise
    if (employeeExists.companyId !== dto.companyId) {
      throw new ValidationError("This employee does not belong to this company.");
    }

    let tokenOrOtp = '';
    let hashedSecret = '';
    let expiresAt: Date;

    // 4. Traitement selon le canal d'invitation
    if (dto.type === InvitationType.EMAIL) {
      tokenOrOtp = this.cryptoService.generateRandomToken();
      hashedSecret = this.cryptoService.cryptoHash(tokenOrOtp);
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    } else if (dto.type === InvitationType.OTP) {
      tokenOrOtp = this.cryptoService.generateOTP();
      hashedSecret = this.cryptoService.cryptoHash(tokenOrOtp);
      expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    } else {
      throw new ValidationError('Invalid invitation type');
    }

    const newEmployeeInvitation = new EmployeeInvitation(
      randomUUID(),
      dto.companyId,
      dto.employeeId,
      dto.type,
      hashedSecret,
      InvitationStatus.PENDING,
      expiresAt,
      new Date()
    );

    await this.invitationRepository.save(newEmployeeInvitation);

    try {
      await this.emailService.sendEmployeeCode(
        employeeExists.email,
        tokenOrOtp,
        companyExists.name
      );
    } catch (error) {
      console.error("L'invitation a été enregistrée mais l'email n'a pas pu être envoyé", error);
    }
  }
}
