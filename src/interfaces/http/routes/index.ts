import { Router } from 'express'
import { companyRoutes } from './company.routes'
import { authRoutes } from './auth.routes'
import { employeeRoutes } from './employee.routes'
import { userRoutes } from './user.routes'
import { locationRoutes } from './location.routes'
import { qrCodeRoutes } from './qr-code.routes'
import { pointageEventRoutes } from './pointage-event.routes'
import { employeeInvitationRoutes } from './employeeInvitation.routes'
import { IJwtTokenService } from '@domain/services/IJwtTokenService'
import { Controllers } from '../../../../container'


export const createRoutes = (controllers: Controllers, jwtService: IJwtTokenService) => {
  const router = Router()

  router.use('/auth', authRoutes(controllers.authController))
  router.use('/companies', companyRoutes(controllers.companyController, jwtService))
  router.use('/employees', employeeRoutes(controllers.employeeController, jwtService))
  router.use('/users', userRoutes(controllers.userController, jwtService))
  router.use('/locations', locationRoutes(controllers.locationController, jwtService))
  router.use('/qrcodes', qrCodeRoutes(controllers.qrCodeController, jwtService))
  router.use('/pointage', pointageEventRoutes(controllers.pointageEventController, jwtService))
  router.use('/invitations', employeeInvitationRoutes(controllers.employeeInvitationController, jwtService))

  return router
}