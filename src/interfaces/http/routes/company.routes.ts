// src/interfaces/http/routes/company.routes.ts
import { Router } from 'express'
import { UserRole } from '@shared/enums'
import { authMiddleware, requireRole } from '@interfaces/middlewares/auth.middleware'
import { CompanyController } from '../controllers/CompanyController'
import { IJwtTokenService } from '@domain/services/IJwtTokenService'
import { upload } from '@interfaces/middlewares/upload.middleware'

export const companyRoutes = (companyController: CompanyController, jwtService: IJwtTokenService) => {
  const router = Router()

  // Protection globale : Authentification requise pour tout le monde
  router.use(authMiddleware(jwtService))

  router.post('/',  requireRole(UserRole.SUPER_ADMIN), companyController.create)
  router.get('/',  requireRole(UserRole.SUPER_ADMIN), companyController.getAll)
  router.get('/:id',requireRole(UserRole.SUPER_ADMIN,UserRole.COMPANY_ADMIN),  companyController.getById)
  router.put('/:id',  requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), companyController.update)
  router.post('/:id/logo',requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN),
    upload.single('logo'),
    companyController.uploadLogo
  )
  router.delete('/:id',  requireRole(UserRole.SUPER_ADMIN), companyController.delete)
 
  return router
}