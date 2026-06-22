import { Router } from "express"
import { AuthController } from "../controllers/AuthController";

export const authRoutes = (authController: AuthController,) => {
    const router = Router();

    router.post('/register', authController.register)
    router.post('/login', authController.login)
    router.post('/refresh/', authController.refreshToken)
    router.post('/forgot-password', authController.forgotPassword)
    router.post('/activate/:token', authController.activateAccount)
    router.post('/reset-password/:token', authController.resetPassword)


    return router
}