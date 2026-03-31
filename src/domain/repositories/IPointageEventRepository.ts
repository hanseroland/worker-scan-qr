import { PointageEvent } from "@domain/entities/PointageEvent";
import { IBaseRepository } from "./IBaseRepository";

export interface IPointageEventRepository extends IBaseRepository<PointageEvent> {
    findByEmployeeId(employeeId: string, companyId: string): Promise<PointageEvent[]>;
    findLastByEmployee(employeeId: string, companyId: string): Promise<PointageEvent | null>;
}