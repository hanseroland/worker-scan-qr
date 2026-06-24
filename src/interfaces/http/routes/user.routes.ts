import { Router } from "express"
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { UserRole } from "@shared/enums";
import { UserController } from "../controllers/UserController";

export const userRoutes = (
    userController:UserController,
    jwtService: IJwtTokenService
) => {
    const router = Router();
    router.use(authMiddleware(jwtService));

    router.get('/:companyId/company',  userController.getByCompanyId)
    router.get('/:id', userController.getById)
    router.put('/:id', userController.update)
    router.delete('/:id', userController.delete)

    return router;
}