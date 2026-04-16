
import { ActivationAccountUseCase } from "@application/use-cases/auth/ActivateAccountUseCase";
import { ForgotPasswordUseCase } from "@application/use-cases/auth/ForgotPasswordUseCase";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { RegisterUserUseCase } from "@application/use-cases/auth/RegisterUserUseCase";
import { ResetPasswordUseCase } from "@application/use-cases/auth/ResetPasswordUseCase";
import { config } from "@shared/config";
import { CreateUserDTO } from "@shared/types/dto.types";
import { NextFunction,Request,Response} from "express";

export class AuthController {
    constructor(
        private activateAccountUseCase: ActivationAccountUseCase,
        private forgotPasswordUseCase: ForgotPasswordUseCase,
        private loginUseCase: LoginUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private registerUserUseCase: RegisterUserUseCase,
        private resetPasswordUseCase : ResetPasswordUseCase,
    ){}

    private setRefreshTokenCookie(res: Response, token: string) {
    const isProd = config.app.env === 'production';

        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: isProd, 
            sameSite: isProd ? 'strict' : 'lax',
            domain: config.app.cookieDomain,
            path: `${config.app.apiUrl}/auth`,
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
    }

    register = async (req:Request<{},{},CreateUserDTO>, res:Response, next:NextFunction)=> {
         try {
            const user = await this.registerUserUseCase.execute(req.body);

            res.status(201)
                .json(
                    { 
                        success: true, 
                        data:  user
                    });
            } catch (error) {
            next(error);
        }
    }
 
    login = async (req:Request<{},{},{email:string,password:string}>, res:Response, next:NextFunction)=> {

        try {
            const { user, accessToken, refreshToken } = await this.loginUseCase.execute(
                req.body.email,
                req.body.password
            );

            this.setRefreshTokenCookie(res, refreshToken);

            res.status(200)
                .json(
                    { 
                        success: true, 
                        data: {user,accessToken} 
                    });
            } catch (error) {
            next(error);
        }
    }

    activateAccount = async (req:Request<{token:string},{},{}>, res:Response, next:NextFunction)=> {

        try {
            const result = await this.activateAccountUseCase.execute(
                req.params.token
            );
            res.status(200)
                .json(
                    { 
                        success: true, 
                        data:result,
                        message: "Account activated"
                    });
            } catch (error) {
            next(error);
        }
    }

    refreshToken = async (req:Request<{},{},{refreshToken:string}>, res:Response, next:NextFunction)=> {
        try {
            const token = req.cookies?.refreshToken || req.body.refreshToken;

            const { accessToken } = await this.refreshTokenUseCase.execute(token);
            res.status(200)
                .json(
                    { 
                        success: true, 
                        data:{accessToken} 
                    });
            } catch (error) {
            next(error);
        }
    }

    forgotPassword = async (req:Request<{},{},{email:string}>, res:Response, next:NextFunction)=> {
        try {
           
            await this.forgotPasswordUseCase.execute(req.body.email);
           
            res.status(200)
                .json(
                    { 
                        success: true, 
                        message: "If an account exists with this email, a reset link has been sent." 
                    });
            } catch (error) {
            next(error);
        }
    }

    resetPassword = async (req:Request<{token:string},{},{newPassword:string}>, res:Response, next:NextFunction)=> {

        try {
            await this.resetPasswordUseCase.execute(
                req.params.token,
                req.body.newPassword
            );

            res.status(200)
                .json(
                    { 
                        success: true, 
                        message: "Password reset successfully" 
                    });
            } catch (error) {
            next(error);
        }
    }



}