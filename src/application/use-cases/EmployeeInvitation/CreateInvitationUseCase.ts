import { EmployeeInvitation } from '@domain/entities/EmployeeInvitation';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { IEmployeeInvitationRepository } from '@domain/repositories/IEmployeeInvitationRepository';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { ICryptoService } from '@domain/services/ICryptoService';
import { IEmailService } from '@domain/services/IEmailService';
import { InvitationStatus, InvitationType } from '@shared/enums';
import { NotFoundError } from '@shared/errors/NotFoundError';
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

  async execute(dto: CreateEmployeeInvitationDTO): Promise<void> {
    const employeeExists = await this.employeeRepository.findById(
      dto.employeeId,
      dto.companyId
    );
    if (!employeeExists) throw new NotFoundError('Employee not found');

    const companyExists = await this.companyRepository.findById(dto.companyId);
    if (!companyExists) throw new NotFoundError('Company not found');

    if (dto.type === InvitationType.EMAIL) {
      // Générer un token d'activation unique
      const token = this.cryptoService.generateRandomToken();
      const hashedToken = this.cryptoService.cryptoHash(token);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expire dans 7 jours

      const newEmployeeInvitation = await new EmployeeInvitation(
        randomUUID(), // Générer un ID unique
        dto.companyId,
        dto.employeeId,
        dto.type,
        hashedToken,
        InvitationStatus.PENDING,
        expiresAt,
        new Date()
      );

      await this.invitationRepository.save(newEmployeeInvitation);

      await this.emailService.sendEmployeeCode(
        employeeExists.email,
        token,
        companyExists.name
      );
    } else if (dto.type === InvitationType.OTP) {
      //  Gérer l'invitation par OTP
      const otp = this.cryptoService.generateOTP();
      const hashedOTP = this.cryptoService.cryptoHash(otp);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expire dans 15 minutes

      const newEmployeeInvitation = await new EmployeeInvitation(
        randomUUID(), // Générer un ID unique
        dto.companyId,
        dto.employeeId,
        dto.type,
        hashedOTP,
        InvitationStatus.PENDING,
        expiresAt,
        new Date()
      );

      await this.invitationRepository.save(newEmployeeInvitation);
      await this.emailService.sendEmployeeCode(
        employeeExists.email,
        otp,
        companyExists.name
      );
    } else {
      throw new Error('Invalid invitation type');
    }
  }
}
