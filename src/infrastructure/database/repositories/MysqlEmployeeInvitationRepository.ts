import { pool } from "../connection";
import { RowDataPacket } from "mysql2";

import { EmployeeInvitation } from "@domain/entities/EmployeeInvitation";
import { IEmployeeInvitationRepository } from "@domain/repositories/IEmployeeInvitationRepository";

import { InvitationStatus, InvitationType } from "@shared/enums";

interface EmployeeInvitationRow extends RowDataPacket {
  id: string;
  companyId: string;
  employeeId: string;
  type: string;
  token: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
}

export class MysqlEmployeeInvitationRepository
  implements IEmployeeInvitationRepository
{

  async findById(id: string, companyId?: string): Promise<EmployeeInvitation | null> {
    const [rows] = await pool.execute<EmployeeInvitationRow[]>(
      `SELECT * FROM employee_invitations WHERE id = ? AND (? IS NULL OR companyId = ?)`,
      [id, companyId ?? null, companyId ?? null]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async findByToken(token: string): Promise<EmployeeInvitation | null> {
    const [rows] = await pool.execute<EmployeeInvitationRow[]>(
      `SELECT * FROM employee_invitations WHERE token = ?`,
      [token]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeeInvitation[]> {
    const [rows] = await pool.execute<EmployeeInvitationRow[]>(
      `SELECT * FROM employee_invitations WHERE employeeId = ?`,
      [employeeId]
    );

    return rows.map(row => this.mapToEntity(row));
  }

  async findLatestEmployeeInvitations(
    employeeId: string
  ): Promise<EmployeeInvitation | null> {
    const [rows] = await pool.execute<EmployeeInvitationRow[]>(
      `SELECT * FROM employee_invitations 
       WHERE employeeId = ? 
       ORDER BY createdAt DESC 
       LIMIT 1`,
      [employeeId]
    );

    if (rows.length === 0) return null;

    return this.mapToEntity(rows[0]);
  }

  async save(entity: EmployeeInvitation): Promise<void> {
    await pool.execute(
      `INSERT INTO employee_invitations 
      (id, companyId, employeeId, type, token, status, expiresAt, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entity.id,
        entity.companyId,
        entity.employeeId,
        entity.type,
        entity.token,
        entity.status,
        entity.expiresAt,
        entity.createdAt
      ]
    );
  }

  async update(entity: EmployeeInvitation): Promise<void> {
    await pool.execute(
      `UPDATE employee_invitations 
       SET type = ?, token = ?, status = ?, expiresAt = ?
       WHERE id = ? AND companyId = ?`,
      [
        entity.type,
        entity.token,
        entity.status,
        entity.expiresAt,
        entity.id,
        entity.companyId
      ]
    );
  }

  async delete(id: string, companyId?: string): Promise<void> {
    await pool.execute(
      `DELETE FROM employee_invitations 
       WHERE id = ? AND (? IS NULL OR companyId = ?)`,
      [id, companyId ?? null, companyId ?? null]
    );
  }

  // Mapper sécurisé (ENUM + Date)
  private mapToEntity(row: EmployeeInvitationRow): EmployeeInvitation {
    return new EmployeeInvitation(
      row.id,
      row.companyId,
      row.employeeId,
      this.mapType(row.type),
      row.token,
      this.mapStatus(row.status),
      new Date(row.expiresAt),
      new Date(row.createdAt)
    );
  }

  // Enum safety
  private mapType(type: string): InvitationType {
    if (!Object.values(InvitationType).includes(type as InvitationType)) {
      throw new Error(`Invalid InvitationType: ${type}`);
    }
    return type as InvitationType;
  }

  private mapStatus(status: string): InvitationStatus {
    if (!Object.values(InvitationStatus).includes(status as InvitationStatus)) {
      throw new Error(`Invalid InvitationStatus: ${status}`);
    }
    return status as InvitationStatus;
  }
}