import { PointageEvent } from '@domain/entities/PointageEvent';
import { IEmployeeRepository } from '@domain/repositories/IEmployeeRepository';
import { IPointageEventRepository } from '@domain/repositories/IPointageEventRepository';
import { UserRole } from '@shared/enums';
import { AuthError } from '@shared/errors/AuthError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class GetPointageEventsByEmployeeUseCase {
  constructor(
    private readonly pointageEventRepository: IPointageEventRepository,
    private readonly employeeRepository: IEmployeeRepository
  ) {}

  async execute(
    employeeId: string,
    requestingUser: { id: string; role: UserRole; companyId: string | null; employeeId: string | null }
  ): Promise<PointageEvent[]> {
    // 1. Vérifier que l'employé existe
    const employeeExists = await this.employeeRepository.findById(employeeId);
    if (!employeeExists) throw new NotFoundError('Employee not found');

    const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
    const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === employeeExists.companyId;
    const isSelf = requestingUser.role === UserRole.EMPLOYEE && requestingUser.employeeId === employeeId;

    // 2. Barrière de sécurité Multi-Tenant
    if (!isSuperAdmin && !isCompanyAdminOwner && !isSelf) {
      throw new AuthError("Permisson denied!");
    }

    // 3. Récupérer tous les événements de pointage
    const pointageEvents = await this.pointageEventRepository.findByEmployeeId(
      employeeId,
      employeeExists.companyId
    );
    // Retourne : PointageEvent[]
    return pointageEvents;
  }
}
