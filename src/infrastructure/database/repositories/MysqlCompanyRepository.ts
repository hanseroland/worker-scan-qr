import { Company } from '@domain/entities/Company'
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository'
import { pool } from '@infrastructure/database/connection'

export class MysqlCompanyRepository implements ICompanyRepository {

  async findById(id: string): Promise<Company | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [id]
    )
    const results = rows as any[]
    if (results.length === 0) return null
    return this.mapToEntity(results[0])
  }

  async findByEmail(email: string): Promise<Company | null> {
     const [rows] = await pool.execute(
        'SELECT * FROM companies WHERE email = ?',
        [email]
     )
     const results = rows as any[]
     if (results.length === 0) return null
     return this.mapToEntity(results[0])
  }

  async findAll(): Promise<Company[]> {
    const [rows] = await pool.execute('SELECT * FROM companies')
    const results = rows as any[]
    return results.map(row => this.mapToEntity(row))
  }

  async save(company: Company): Promise<void> {
    await pool.execute(
            'INSERT INTO companies (id, name, email, phone, logo, isActive, createdAt, employeeCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                company.id,
                company.name,
                company.email,
                company.phone,
                company.logo, 
                company.isActive,
                company.createdAt, 
                company.employeeCount
            ]
            
    );
  }

  async update(company: Company): Promise<void> {
    await pool.execute(
    `UPDATE companies 
     SET name = ?, email = ?, phone = ?, logo = ?, isActive = ?, employeeCount = ?
     WHERE id = ?`,
    [company.name, company.email, company.phone, company.logo, 
     company.isActive, company.employeeCount, company.id]
  )
  }

  async delete(id: string): Promise<void> {
   await pool.execute(
    'DELETE FROM companies WHERE id = ?',
    [id]
  )
  }

  // Mapper les résultats SQL vers l'entité Company
  private mapToEntity(row: any): Company {
    return new Company(
      row.id,
      row.name,
      row.email,
      row.phone,
      row.logo,
      row.isActive === 1,  // MySQL retourne 0/1 pour les booléens
      new Date(row.createdAt),
      row.employeeCount
    )
  }
}