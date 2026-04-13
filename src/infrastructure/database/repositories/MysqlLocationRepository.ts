import { Location } from "@domain/entities/Location";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { pool } from "../connection";
import { RowDataPacket } from "mysql2";


interface LocationRow extends RowDataPacket {
  id: string;
  companyId: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export class MysqlLocationRepository implements ILocationRepository {
    
    async findById(id: string, companyId: string): Promise<Location | null> {

        const [rows] = await pool.execute<LocationRow[]>(
            'SELECT * FROM locations WHERE id = ? AND companyId = ?',
            [id,companyId]
        )

         
        if (rows.length === 0) return null
        return this.mapToEntity(rows[0])
    }

    async findByCompanyLocations(companyId: string): Promise<Location[]> {

        const [rows] = await pool.execute<LocationRow[]>(
            'SELECT * FROM locations WHERE companyId = ?',
            [companyId]
        )
       
        return rows.map(row => this.mapToEntity(row))
    }

    async save(location: Location): Promise<void> {
        await pool.execute(
            'INSERT INTO locations (id, companyId, name, latitude, longitude, radius) VALUES (?,?,?,?,?,?)',
            [
                location.id,
                location.companyId,
                location.name,
                location.latitude,
                location.longitude,
                location.radius
            ]
        )
    }

    async update(location: Location): Promise<void> {
        await pool.execute(
            'UPDATE locations SET companyId = ?, name = ?, latitude = ?, longitude = ?, radius = ? WHERE id= ?',
            [
                location.companyId,
                location.name,
                location.latitude,
                location.longitude,
                location.radius,
                location.id
            ]
        )
    }

    async delete(id: string, companyId: string): Promise<void> {
            await pool.execute('DELETE FROM locations WHERE id = ? AND companyId = ?', [id, companyId]);

    }

    // Mapper les résultats SQL vers l'entité Location
          private mapToEntity(row: LocationRow): Location {
            return new Location(
              row.id,
              row.companyId,
              row.name,
              row.latitude,
              row.longitude,
              row.radius
            )
     }
}