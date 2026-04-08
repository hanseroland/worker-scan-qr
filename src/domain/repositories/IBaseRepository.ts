export interface IBaseRepository<T> {
  // findById avec companyId optionnel pour le multi-tenant
  findById(id: string, companyId?: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: string, companyId?: string): Promise<void>;
}
