import { InvitationStatus, InvitationType } from "@shared/enums";
import { TenantEntity } from "./BaseEntity";

export class EmployeeInvitation extends TenantEntity {
    constructor(
        public readonly id: string,
        companyId: string,
        public readonly employeeId: string,
        public type: InvitationType,
        public token: string,
        public status: InvitationStatus,
        public expiresAt: Date,
        public readonly createdAt: Date

    ) {
        super(companyId)
    }
}