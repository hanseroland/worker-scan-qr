import { Location } from "@domain/entities/Location";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { pool } from "../connection";

export class MysqlLocationRepository implements ILocationRepository {
    
    async findById(id: string, companyId: string): Promise<Location | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM locations WHERE id = ? AND companyId = ?',
            [id,companyId]
        )

         const results = rows as any[]
        if (results.length === 0) return null
        return this.mapToEntity(results[0])
    }

    async findByCompanyLocations(companyId: string): Promise<Location[]> {
        const [rows] = await pool.execute(
            'SELECT * FROM locations WHERE companyId = ?',
            [companyId]
        )
        const results = rows as any[]
        return results.map(row => this.mapToEntity(row))
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
          private mapToEntity(row: any): Location {
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