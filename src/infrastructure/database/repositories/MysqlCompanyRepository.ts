import { Company } from '@domain/entities/Company';
import { ICompanyRepository } from '@domain/repositories/ICompanyRepository';
import { pool } from '@infrastructure/database/connection';
import { RowDataPacket } from 'mysql2';

interface CompanyRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo: string;
  isActive : number;
  createdAt: Date,
  employeeCount: number
}

export class MysqlCompanyRepository implements ICompanyRepository {

  async findById(id: string): Promise<Company | null> {
    const [rows] = await pool.execute<CompanyRow[]>
    ('SELECT * FROM companies WHERE id = ?', [
      id,
    ]);
    
    if (rows.length === 0) return null;
    return this.mapToEntity(rows[0]);
  }

  async findByEmail(email: string): Promise<Company | null> {
    const [rows] = await pool.execute<CompanyRow[]>(
      'SELECT * FROM companies WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) return null;
    return this.mapToEntity(rows[0]);
  }

  async findAll(): Promise<Company[]> {
    const [rows] = await pool.execute<CompanyRow[]>
    ('SELECT * FROM companies');
   
    return rows.map((row) => this.mapToEntity(row));
  }

  async save(company: Company): Promise<void> {
    await pool.execute(
      `INSERT INTO companies (id, name, email, phone, logo, isActive, createdAt, employeeCount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company.id,
        company.name,
        company.email,
        company.phone,
        company.logo,
        company.isActive ? 1 : 0,
        company.createdAt,
        company.employeeCount,
      ]
    );
  }

  async update(company: Company): Promise<void> {
    await pool.execute(
      `UPDATE companies 
     SET name = ?, email = ?, phone = ?, logo = ?, isActive = ?, employeeCount = ?
     WHERE id = ?`,
      [
        company.name,
        company.email,
        company.phone,
        company.logo,
        company.isActive ? 1 : 0,
        company.employeeCount,
        company.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await pool.execute('DELETE FROM companies WHERE id = ?', [id]);
  }

  // Mapper les résultats SQL vers l'entité Company
  private mapToEntity(row: CompanyRow): Company {
    return new Company(
      row.id,
      row.name,
      row.email,
      row.phone,
      row.logo,
      row.isActive === 1, // MySQL retourne 0/1 pour les booléens
      new Date(row.createdAt),
      row.employeeCount
    );
  }
}
