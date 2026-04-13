import { pool } from "../connection";
import { RowDataPacket } from "mysql2";

import { QRCode } from "@domain/entities/QRCode";
import { IQRCodeRepository } from "@domain/repositories/IQRCodeRepository";

interface QRCodeRow extends RowDataPacket {
  id: string;
  companyId: string;
  locationId: string;
  code: string;
  expiresAt: Date;
  isActive: number;
}

export class MysqlQRCodeRepository implements IQRCodeRepository {

  async findById(id: string, companyId: string): Promise<QRCode | null> {
    const [rows] = await pool.execute<QRCodeRow[]>(
      `SELECT * FROM qrcodes 
       WHERE id = ? AND companyId = ?)`,
      [id, companyId]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async findByCode(code: string): Promise<QRCode | null> {
    const [rows] = await pool.execute<QRCodeRow[]>(
      `SELECT * FROM qrcodes WHERE code = ?`,
      [code]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async findActive(locationId: string): Promise<QRCode[]> {
    const [rows] = await pool.execute<QRCodeRow[]>(
      `SELECT * FROM qrcodes 
       WHERE locationId = ? AND isActive = 1`,
      [locationId]
    );

    return rows.map(row => this.mapToEntity(row));
  }

  async deactivateAllByLocation(locationId: string, companyId: string): Promise<void> {
    await pool.execute(
      `UPDATE qrcodes 
       SET isActive = 0 
       WHERE locationId = ? AND companyId = ?`,
      [locationId, companyId]
    );
  }

  async save(entity: QRCode): Promise<void> {
    await pool.execute(
      `INSERT INTO qrcodes 
      (id, companyId, locationId, code, expiresAt, isActive)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entity.id,
        entity.companyId,
        entity.locationId,
        entity.code,
        entity.expiresAt,
        entity.isActive ? 1 : 0
      ]
    );
  }

  async update(entity: QRCode): Promise<void> {
    await pool.execute(
      `UPDATE qrcodes 
       SET code = ?, expiresAt = ?, isActive = ?
       WHERE id = ? AND companyId = ?`,
      [
        entity.code,
        entity.expiresAt,
        entity.isActive ? 1 : 0,
        entity.id,
        entity.companyId
      ]
    );
  }

  async delete(id: string, companyId?: string): Promise<void> {
    await pool.execute(
      `DELETE FROM qrcodes 
       WHERE id = ? AND (? IS NULL OR companyId = ?)`,
      [id, companyId ?? null, companyId ?? null]
    );
  }

  private mapToEntity(row: QRCodeRow): QRCode {
    return new QRCode(
      row.id,
      row.companyId,
      row.locationId,
      row.code,
      new Date(row.expiresAt),
      row.isActive === 1
    );
  }
}