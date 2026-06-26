import { Router } from "express";
import { LocationController } from "../controllers/LocationController";
import { authMiddleware, requireRole } from "@interfaces/middlewares/auth.middleware";
import { IJwtTokenService } from "@domain/services/IJwtTokenService";
import { UserRole } from "@shared/enums";

export const locationRoutes = (locationController: LocationController, jwtService: IJwtTokenService) => {
    const router = Router();

    // Protection globale : Connexion requise
    router.use(authMiddleware(jwtService));

    // 1. Créer une zone -> Admins uniquement
    router.post('/', requireRole(UserRole.COMPANY_ADMIN), locationController.create);
    
    // 2. Récupérer toutes les zones -> Admins uniquement (Filtré par entreprise automatiquement)
    router.get('/', requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), locationController.getAll);
    
    // 3. Récupérer une zone par son ID -> Tout le monde (Utile à l'employé pour checker sa localisation)
    router.get('/:id', locationController.getById);
    
    // 4. Modifier une zone -> Admins uniquement
    router.put('/:id', requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), locationController.update);
    
    // 5. Supprimer une zone -> Admins uniquement
    router.delete('/:id', requireRole(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN), locationController.delete);

    return router;
};