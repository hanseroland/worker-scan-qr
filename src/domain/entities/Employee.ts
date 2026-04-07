import { TenantEntity } from "./BaseEntity";

export class Employee extends TenantEntity {

    constructor(
        public readonly id: string,
        companyId: string,
        public userId: string | null,
        public firstName: string, 
        public lastName: string,
        public picture: string | null,
        public email: string,
        public phone: string | null,
        public readonly employeeCode: string,
        public isActive: boolean,
        public readonly createdAt: Date,
    ) {
        super(companyId)
    }
} 