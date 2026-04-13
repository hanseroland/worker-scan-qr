// Étendre l'interface Request d'Express
import { UserRole } from '@shared/enums'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: UserRole
        companyId: string | null
        employeeId: string | null
      }
    }
  }
}