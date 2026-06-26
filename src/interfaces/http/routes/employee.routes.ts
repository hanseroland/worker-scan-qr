import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { UserRole } from "@shared/enums";
import { upload } from "@interfaces/middlewares/upload.middleware";

export const employeeRoutes = (employeeController:EmployeeController,jwtService: IJwtTokenService) =>{
    const router = Router();

    // Protection globale
    router.use(authMiddleware(jwtService));

    router.post('/',requireRole(UserRole.COMPANY_ADMIN), employeeController.create )
    router.get('/', requireRole(UserRole.COMPANY_ADMIN), employeeController.getAll )
    router.get('/:id', employeeController.getById );
    router.put('/:id', employeeController.update );
    router.post('/:id/picture',upload.single('picture'),employeeController.uploadPicture)
    router.delete('/:id',requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), employeeController.delete )

    return router
}