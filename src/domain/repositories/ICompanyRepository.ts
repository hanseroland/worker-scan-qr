import { Company } from "@domain/entities/Company"

export interface ICompanyRepository {
    findById(id: string): Promise<Company | null>
    findByEmail(email: string): Promise<Company | null>
    save(company: Company): Promise<void>
    update(company: Company): Promise<void>
    delete(id: string): Promise<void>
}