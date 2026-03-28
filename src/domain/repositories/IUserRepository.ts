import { User } from "@domain/entities/User";

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmployeeId(employeeId: string): Promise<User | null>;
    save(user: User): Promise<void>;
    update(user: User): Promise<void>;
}