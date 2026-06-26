import { Router } from "express";
import { PointageEventController } from "../controllers/PointageEventController";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { UserRole } from "@shared/enums";

export const pointageEventRoutes = (pointageEventController: PointageEventController, jwtService: IJwtTokenService) => {
    const router = Router();

    router.use(authMiddleware(jwtService));

    // 1. Un employé scanne son QR Code de présence -> Employé uniquement
    router.post('/scan', requireRole(UserRole.EMPLOYEE), pointageEventController.scan);
    
    // 2. Récupérer l'historique de pointage d'un employé précis -> Tout le monde (avec filtres dans le Use Case)
    router.get('/employee/:employeeId', pointageEventController.getByEmployee);

    return router;
};