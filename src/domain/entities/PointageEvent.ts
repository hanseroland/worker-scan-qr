import { PointageType } from "@shared/enums";
import { TenantEntity } from "./BaseEntity";

export class PointageEvent extends TenantEntity {
    constructor(
        public readonly id: string,
        companyId: string,
        public readonly employeeId: string,
        public type: PointageType,
        public readonly scannedAt: Date,
        public latitude: number,
        public longitude: number,
        public isValide: boolean
    ) {
        super(companyId)
    }
}