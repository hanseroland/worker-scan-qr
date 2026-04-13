import { Request, Response, NextFunction } from 'express'
import { IJwtTokenService } from '@domain/services/IJwtTokenService'
import { AuthError } from '@shared/errors/AuthError'
import { UserRole } from '@shared/enums'

export const authMiddleware = (jwtService: IJwtTokenService) => {
  return (req: Request, res: Response, next: NextFunction) => {

    try {
         // 1. Récupérer le token dans le header Authorization
        const authHeader = req.headers.authorization;

        // 2. Vérifier format "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AuthError('No token provided'));
        }
        // 3. Vérifier le token avec jwtService
        const token = authHeader.split(' ')[1];
        const decoded = jwtService.verifyAccessToken(token);

        if (!decoded) return next(new AuthError('Invalid token'))

        // 4. Attacher req.user
        req.user = decoded as { id: string, role: UserRole, companyId: string | null, employeeId: string | null }
        // 5. Appeler next()
        next();
    } catch (error) {
        return next(new AuthError('Invalid or expired token'));

    }
   
  }
}

// Middleware de vérification des rôles
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AuthError('Not authenticated'))
    
    if (!roles.includes(req.user.role)) {
      return next(new AuthError('Insufficient permissions'))
    }
    
    next()
  }
}