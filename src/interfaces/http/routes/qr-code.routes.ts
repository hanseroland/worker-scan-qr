import { Router } from "express";
import { QRCodeController } from "../controllers/QRCodeController";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { UserRole } from "@shared/enums";

export const qrCodeRoutes = (qrCodeController: QRCodeController, jwtService: IJwtTokenService) => {
    const router = Router();

    // Protection globale : Connexion requise
    router.use(authMiddleware(jwtService));

    // 1. Générer un QR Code pour une zone -> Admins uniquement
    router.post('/generate', requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), qrCodeController.generate);
    
    // 2. Forcer la rotation manuelle/immédiate d'un QR Code -> Admins uniquement
    router.post('/rotate', requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), qrCodeController.rotate);
    
    // 3. Valider un QR Code (Vérification de portée et géolocalisation) -> Tout le monde
    router.post('/validate', qrCodeController.validate);

    return router;
};