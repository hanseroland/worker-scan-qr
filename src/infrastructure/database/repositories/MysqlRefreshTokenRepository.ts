import { RefreshToken } from "@domain/entities/RefreshToken";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { pool } from "../connection";
import { RowDataPacket } from "mysql2";


interface RefreshTokenRow extends RowDataPacket {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export class MysqlRefreshTokenRepository implements IRefreshTokenRepository {

    async findByToken(token: string): Promise<RefreshToken | null> {
        const [rows] = await pool.execute<RefreshTokenRow[]>(
                    'SELECT * FROM refreshtokens WHERE token = ?',
                    [token]
                )
        
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
    }

    async findByUserId(userId: string): Promise<RefreshToken[]> {
        const [rows] = await pool.execute<RefreshTokenRow[]>(
            'SELECT * FROM refreshtokens WHERE userId = ?',
            [userId]
        )
       
        return rows.map(row => this.mapToEntity(row))
    }


    async save(refreshToken: RefreshToken): Promise<void> {
        await pool.execute(
            `INSERT INTO refreshtokens (id, token, userId, expiresAt, createdAt) 
            VALUES (?,?,?,?,?)`,
            [
                refreshToken.id,
                refreshToken.token,
                refreshToken.userId,
                refreshToken.expiresAt,
                refreshToken.createdAt
            ]
        )
    }

    async deleteByToken(token: string): Promise<void> {
         await pool.execute(
            'DELETE FROM refreshtokens WHERE token = ?', 
            [token]
        );
    }

    async deleteByUserId(userId: string): Promise<void> {
         await pool.execute(
            'DELETE FROM refreshtokens WHERE userId = ?', 
            [userId]
        );
    }

    // Mapper les résultats SQL vers l'entité RefreshToken
              private mapToEntity(row: RefreshTokenRow): RefreshToken {
                return new RefreshToken(
                  row.id,
                  row.token,
                  row.userId,
                   new Date(row.expiresAt),
                  new Date(row.createdAt),
                )
         }
    
}