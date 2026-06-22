// src/interfaces/http/routes/company.routes.ts
import { Router } from 'express'
import { UserRole } from '@shared/enums'
import { authMiddleware, requireRole } from '@interfaces/middlewares/auth.middleware'
import { CompanyController } from '../controllers/CompanyController'
import { IJwtTokenService } from '@domain/services/IJwtTokenService'
import { upload } from '@interfaces/middlewares/upload.middleware'

export const companyRoutes = (companyController: CompanyController, jwtService: IJwtTokenService) => {
  const router = Router()

  router.post('/', authMiddleware(jwtService), requireRole(UserRole.SUPER_ADMIN), companyController.create)
   router.post('/:id/logo',authMiddleware(jwtService),requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN),
    upload.single('logo'),
    companyController.uploadLogo
  )
  router.get('/', authMiddleware(jwtService), requireRole(UserRole.SUPER_ADMIN), companyController.getAll)
  router.get('/:id', authMiddleware(jwtService), companyController.getById)
  router.put('/:id', authMiddleware(jwtService), requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), companyController.update)
  router.delete('/:id', authMiddleware(jwtService), requireRole(UserRole.SUPER_ADMIN), companyController.delete)
 
  return router
}