import { Employee } from "@domain/entities/Employee";
import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { pool } from "../connection";

export class MysqlEmployeeRepository implements IEmployeeRepository{

    async findById(id: string, companyId: string): Promise<Employee | null> {

       const [rows] = await pool.execute(
        'SELECT * FROM employees WHERE id = ? AND companyId = ?',
        [id, companyId]
        )
        const results = rows as any[]
        if (results.length === 0) return null
        return this.mapToEntity(results[0])
    }

    async findByEmail(email: string): Promise<Employee | null> {
         const [rows] = await pool.execute(
            'SELECT * FROM employees WHERE email = ?',
            [email]
         )
        const results = rows as any[]
        if (results.length === 0) return null
        return this.mapToEntity(results[0])
    }

    async findAllByCompany(companyId: string): Promise<Employee[]> {
        const [rows] = await pool.execute(
            'SELECT * FROM employees WHERE companyId = ?',
            [companyId]
        )
        const results = rows as any[]
        return results.map(row => this.mapToEntity(row))
    }

    async findByEmployeeCode(code: string, companyId: string): Promise<Employee | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM employees WHERE employeeCode = ? AND companyId = ?',
            [code,companyId]
        )
        const results = rows as any[]
        if (results.length === 0) return null
        return this.mapToEntity(results[0])
    }

    async save(employee: Employee): Promise<void> {
        await pool.execute(
            `INSERT INTO employees (id, companyId, userId, firstName, lastName, 
             picture, email, phone, employeeCode, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee.id,
                employee.companyId,
                employee.userId,
                employee.firstName,
                employee.lastName,
                employee.picture, 
                employee.email,
                employee.phone,
                employee.employeeCode,
                employee.isActive,
                 employee.createdAt
            ]
            
      );
    }

    async update(employee: Employee): Promise<void> {
        await pool.execute(
        `UPDATE employees 
        SET companyId = ?, userId = ?, firstName = ?, lastName = ?, picture = ?, email = ?, phone = ?, employeeCode = ?,
         isActive = ? WHERE id = ? AND companyId = ? `,
        [
            employee.companyId,
            employee.userId,
            employee.firstName, 
            employee.lastName, 
            employee.picture, 
            employee.email,
            employee.phone, 
            employee.employeeCode,
            employee.isActive, 
            employee.id, 
            employee.companyId
        ]
    )
    }

    async delete(id: string, companyId?: string): Promise<void> {
        const query = companyId 
                ? 'UPDATE employees SET isActive = ? WHERE id = ? AND companyId = ?'
                : 'UPDATE employees SET isActive = ? WHERE id = ?'

        const params = companyId ? [false, id, companyId] : [false, id]
        await pool.execute(`${query}`, params)
    }


      // Mapper les résultats SQL vers l'entité Employee
      private mapToEntity(row: any): Employee {
        return new Employee(
          row.id,
          row.companyId,
          row.userId,
          row.firstName,
          row.lastName,
          row.picture, 
          row.email,
          row.phone,
          row.employeeCode,
          row.isActive  === 1,
          new Date(row.createdAt)
        )
      }
    
}
