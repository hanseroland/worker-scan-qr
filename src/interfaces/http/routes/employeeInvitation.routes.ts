import { Router } from "express"
import { EmployeeInvitationController } from "../controllers/EmployeeInvitationController";
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { UserRole } from "@shared/enums";

export const employeeInvitationRoutes = (
    employeeInvitationController:EmployeeInvitationController,
    jwtService: IJwtTokenService
) => {
    const router = Router();

    router.post('/', authMiddleware(jwtService), requireRole(UserRole.COMPANY_ADMIN), employeeInvitationController.create)
    router.post('/accept', employeeInvitationController.accept)

    return router;
}