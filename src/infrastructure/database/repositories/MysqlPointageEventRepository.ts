import { PointageEvent } from "@domain/entities/PointageEvent";
import { IPointageEventRepository } from "@domain/repositories/IPointageEventRepository";
import { PointageType } from "@shared/enums";
import { ValidationError } from "@shared/errors/ValidationError";
import { RowDataPacket } from "mysql2";
import { pool } from "../connection";

interface PointageEventRow extends RowDataPacket {
        id: string;
        companyId: string;
        employeeId: string;
        type: string;
        scannedAt: Date;
        latitude: number;
        longitude: number;
        isValide: number
}

export class MysqlPointageEventRepository implements IPointageEventRepository {
    
    async findById(id: string, companyId?: string): Promise<PointageEvent | null> {
    const [rows] = await pool.execute<PointageEventRow[]>(
      `SELECT * FROM pointage_events 
       WHERE id = ? AND (? IS NULL OR companyId = ?)`,
      [id, companyId ?? null, companyId ?? null]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async findByEmployeeId(
    employeeId: string,
    companyId: string
  ): Promise<PointageEvent[]> {
    const [rows] = await pool.execute<PointageEventRow[]>(
      `SELECT * FROM pointage_events 
       WHERE employeeId = ? AND companyId = ?
       ORDER BY scannedAt DESC`,
      [employeeId, companyId]
    );

    return rows.map(row => this.mapToEntity(row));
  }

  async findLastByEmployee(
    employeeId: string,
    companyId: string
  ): Promise<PointageEvent | null> {
    const [rows] = await pool.execute<PointageEventRow[]>(
      `SELECT * FROM pointage_events 
       WHERE employeeId = ? AND companyId = ?
       ORDER BY scannedAt DESC
       LIMIT 1`,
      [employeeId, companyId]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async save(entity: PointageEvent): Promise<void> {
    await pool.execute(
      `INSERT INTO pointage_events
      (id, companyId, employeeId, type, scannedAt, latitude, longitude, isValide)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entity.id,
        entity.companyId,
        entity.employeeId,
        entity.type,
        entity.scannedAt,
        entity.latitude,
        entity.longitude,
        entity.isValide ? 1 : 0
      ]
    );
  }

  async update(entity: PointageEvent): Promise<void> {
    await pool.execute(
      `UPDATE pointage_events 
       SET type = ?, latitude = ?, longitude = ?, isValide = ?
       WHERE id = ? AND companyId = ?`,
      [
        entity.type,
        entity.latitude,
        entity.longitude,
        entity.isValide ? 1 : 0,
        entity.id,
        entity.companyId
      ]
    );
  }

  async delete(id: string, companyId?: string): Promise<void> {
    await pool.execute(
      `DELETE FROM pointage_events 
       WHERE id = ? AND (? IS NULL OR companyId = ?)`,
      [id, companyId ?? null, companyId ?? null]
    );
  }

  // Mapper sécurisé (ENUM + Date)
    private mapToEntity(row: PointageEventRow): PointageEvent {
      return new PointageEvent(
        row.id,
        row.companyId,
        row.employeeId,
        this.mapType(row.type),
        new Date(row.scannedAt),
        row.latitude,
        row.longitude,
        row.isValide === 1
      );
    }
  
    // Enum safety
    private mapType(type: string): PointageType {
      if (!Object.values(PointageType).includes(type as PointageType)) {
        throw new ValidationError(`Invalid PointageType: ${type}`);
      }
      return type as PointageType;
    }
  
}