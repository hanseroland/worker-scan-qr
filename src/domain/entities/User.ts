import { UserRole } from "@shared/enums";

export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public password: string,
        public role: UserRole,
        public companyId: string | null,
        public employeeId: string | null,
        public readonly createdAt: Date
    ) {

    }
}