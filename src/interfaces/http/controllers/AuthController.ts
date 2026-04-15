
import { ActivationAccountUseCase } from "@application/use-cases/auth/ActivateAccountUseCase";
import { ForgotPasswordUseCase } from "@application/use-cases/auth/ForgotPasswordUseCase";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/auth/RefreshTokenUseCase";
import { RegisterUserUseCase } from "@application/use-cases/auth/RegisterUserUseCase";
import { ResetPasswordUseCase } from "@application/use-cases/auth/ResetPasswordUseCase";
import { CreateUserDTO } from "@shared/types/dto.types";
import { NextFunction,Request,Response} from "express";

export class AuthController {
    constructor(
        private activateAccountUseCase: ActivationAccountUseCase,
        private forgotPasswordUseCase: ForgotPasswordUseCase,
        private loginUseCase: LoginUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private registerUserUseCase: RegisterUserUseCase,
        private resetPasswordUseCase : ResetPasswordUseCase
    ){}

    register = async (req:Request<{},{},CreateUserDTO>, res:Response, next:NextFunction)=> {
         try {
            const result = await this.registerUserUseCase.execute(req.body);
            res.status(201)
                .json(
                    { 
                        success: true, 
                        data:  result
                    });
            } catch (error) {
            next(error);
        }
    }

    login = async (req:Request<{},{},{email:string,password:string}>, res:Response, next:NextFunction)=> {

        try {
            const result = await this.loginUseCase.execute(
                req.body.email,
                req.body.password
            );
            res.status(200)
                .json(
                    { 
                        success: true, 
                        data: result 
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
                        data:result 
                    });
            } catch (error) {
            next(error);
        }
    }

    refreshToken = async (req:Request<{},{},{refreshToken:string}>, res:Response, next:NextFunction)=> {
        try {
            const result = await this.refreshTokenUseCase.execute(
                req.body.refreshToken
            );
            res.status(200)
                .json(
                    { 
                        success: true, 
                        data:result 
                    });
            } catch (error) {
            next(error);
        }
    }

    forgotPassword = async (req:Request<{},{},{email:string}>, res:Response, next:NextFunction)=> {
        try {
            const result = await this.forgotPasswordUseCase.execute(req.body.email);
            res.status(200)
                .json(
                    { 
                        success: true, 
                        data:result  
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