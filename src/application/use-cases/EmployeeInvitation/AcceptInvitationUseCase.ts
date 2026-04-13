import { EmployeeInvitation } from '@domain/entities/EmployeeInvitation';
import { IEmployeeInvitationRepository } from '@domain/repositories/IEmployeeInvitationRepository';
import { ICryptoService } from '@domain/services/ICryptoService';
import { InvitationStatus } from '@shared/enums';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { AcceptInvitationDTO } from '@shared/types/dto.types';

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: IEmployeeInvitationRepository,
    private cryptoService: ICryptoService
  ) {}

  async execute(dto: AcceptInvitationDTO): Promise<void> {
    const hashedToken = this.cryptoService.cryptoHash(dto.token);
    const invitation = await this.invitationRepository.findByToken(hashedToken);
    if (!invitation) throw new NotFoundError('Invitation not found');
    if (invitation.expiresAt < new Date())
      throw new NotFoundError('Invitation expired');

    const updatedInvitation = new EmployeeInvitation(
      invitation.id,
      invitation.companyId,
      invitation.employeeId,
      invitation.type,
      invitation.token,
      InvitationStatus.ACCEPTED,
      invitation.expiresAt,
      invitation.createdAt
    );

    await this.invitationRepository.update(updatedInvitation);
  }
}
