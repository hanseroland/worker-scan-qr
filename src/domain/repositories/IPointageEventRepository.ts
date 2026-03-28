import { PointageEvent } from "@domain/entities/PointageEvent";

export interface IPointageEventRepository {
    findByEmployeeId(employeeId: string, companyId: string): Promise<PointageEvent[]>;
    findLastByEmployee(employeeId: string, companyId: string): Promise<PointageEvent[] | null>;
    save(event: PointageEvent): Promise<void>;
}