import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { UserRole } from "@shared/enums";
import { upload } from "@interfaces/middlewares/upload.middleware";

export const employeeRoutes = (employeeController:EmployeeController,jwtService: IJwtTokenService) =>{
    const router = Router();

    router.post('/',authMiddleware(jwtService),requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), employeeController.create )
    router.post('/:employeeId/picture',authMiddleware(jwtService),upload.single('picture'),employeeController.uploadPicture)
    router.get('/',authMiddleware(jwtService), requireRole(UserRole.COMPANY_ADMIN), employeeController.getAll )
    router.get('/:id',authMiddleware(jwtService), employeeController.getById );
    router.put('/:id',authMiddleware(jwtService),requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), employeeController.update );
     router.delete('/:id',authMiddleware(jwtService),requireRole(UserRole.COMPANY_ADMIN), employeeController.delete )



    return router
}