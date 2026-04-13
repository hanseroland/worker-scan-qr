import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { pool } from "../connection";
import { RowDataPacket } from "mysql2";
import { UserRole } from "@shared/enums";
 
interface UserRow extends RowDataPacket {
      id: string;
      email: string;
      password: string;
      role: string;
      companyId: string;
      employeeId: string;
      isActive: number;
      activationToken: string;
      activationTokenExpires: Date;
      resetPasswordToken: string;
      resetPasswordExpires: Date;
      createdAt: Date;
}

export class MysqlUserRepository implements IUserRepository{

     async findById(id: string, companyId?: string): Promise<User | null> {
         const [rows] = await pool.execute<UserRow[]>(
            'SELECT * FROM users WHERE id = ?',[id]
         )
        
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
     }

     async findByEmail(email: string): Promise<User | null> {

         const [rows] = await pool.execute<UserRow[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
         )
        
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
     }

     async findByEmployeeId(employeeId: string): Promise<User | null> {
         const [rows] = await pool.execute<UserRow[]>(
            'SELECT * FROM users WHERE employeeId = ?', [employeeId]
         )

        
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
     }

   

     async findAll(): Promise<User[]> {
        const [rows] = await pool.execute<UserRow[]>
        ('SELECT * FROM users')
        
        return rows.map(row => this.mapToEntity(row))
     }

     async findByActivationToken(hashedActivationToken: string): Promise<User | null> {
         const [rows] = await pool.execute<UserRow[]>(
            'SELECT * FROM users WHERE activationToken = ?', [hashedActivationToken]
         )

        
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
     }

     async findByResetPasswordToken(hashedResetPasswordToken: string): Promise<User | null> {
         const [rows] = await pool.execute<UserRow[]>(
            'SELECT * FROM users WHERE resetPasswordToken = ?', [hashedResetPasswordToken]
         )

        
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
     }

     async findAllByCompanyId(companyId: string): Promise<User[]> {
        const [rows] = await pool.execute<UserRow[]>
        ('SELECT * FROM users WHERE companyId = ?', 
         [companyId]
        )
        
        return rows.map(row => this.mapToEntity(row))
     }

     async save(user: User): Promise<void> {
          await pool.execute(
            `INSERT INTO users (id, email, password, role, companyId, employeeId, isActive, activationToken, 
             activationTokenExpires, resetPasswordToken,resetPasswordExpires, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                user.email,
                user.password,
                user.role,
                user.companyId || null,
                user.employeeId,
                user.isActive ? 1 : 0, 
                user.activationToken,
                user.activationTokenExpires, 
                user.resetPasswordToken,
                user.resetPasswordExpires, 
                user.createdAt
            ]
            
        );
     }

    async update(user: User): Promise<void> {
        await pool.execute(
            `UPDATE users SET email = ?, password = ?, role = ?, companyId = ?, employeeId = ?, isActive = ?, activationToken = ?, 
             activationTokenExpires = ?, resetPasswordToken = ?,resetPasswordExpires = ? WHERE id = ?`,
            [
                
                user.email,
                user.password,
                user.role,
                user.companyId || null,
                user.employeeId,
                user.isActive ? 1 : 0,
                user.activationToken,
                user.activationTokenExpires,
                user.resetPasswordToken,
                user.resetPasswordExpires,
                user.id 
            ]
            
        );
    }

    async delete(id: string): Promise<void> {
        await pool.execute('UPDATE users SET isActive = ?  WHERE id = ?', [false, id]);
    }

    // Mapper les résultats SQL vers l'entité User
      private mapToEntity(row: UserRow): User {
        return new User(
          row.id,
          row.email,
          row.password,
          row.role as UserRole,
          row.companyId || null,
          row.employeeId,
          row.isActive === 1,  // MySQL retourne 0/1 pour les booléens
          row.activationToken,
          row.activationTokenExpires,
          row.resetPasswordToken,
          row.resetPasswordExpires,
          new Date(row.createdAt),
        )
      }
}