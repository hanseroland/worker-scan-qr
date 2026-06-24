import { DeleteUserUseCase } from "@application/use-cases/user/DeleteUserUseCase";
import { GetCompanyUsersUseCase } from "@application/use-cases/user/GetCompanyUsersUseCase";
import { GetUserUseCase } from "@application/use-cases/user/GetUserUseCase";
import { UpdateUserUseCase } from "@application/use-cases/user/UpdateUserUseCase";
import { UserRole } from "@shared/enums";
import { UpdateUserDTO } from "@shared/types/dto.types";
import { NextFunction, Request, Response } from "express";

export class UserController {
    constructor(
        private getCompanyUsersUseCase: GetCompanyUsersUseCase,
        private getUserUseCase: GetUserUseCase,
        private updateUserUseCase: UpdateUserUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
    ) { }


    getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const result = await this.getUserUseCase.execute(
                req.params.id,
                req.user!
            );
            res.status(200).json(
                {
                    success: true,
                    data: result
                }
            );
        } catch (error) {
            next(error);
        }
    }

    getByCompanyId = async (req: Request<{ companyId: string }>, res: Response, next: NextFunction) => {
        try {

            //Vérifier l'autorisation comme dans LocationController
            const isSuperAdmin = req.user?.role === UserRole.SUPER_ADMIN;
            const isCompanyAdminOwner =
                req.user?.role === UserRole.COMPANY_ADMIN &&
                req.user?.companyId === req.params.companyId;

            if (!isSuperAdmin && !isCompanyAdminOwner) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            const result = await this.getCompanyUsersUseCase.execute(req.params.companyId,req.user!);
            res.status(200).json(
                {
                    success: true,
                    data: result
                }
            );
        } catch (error) {
            next(error);
        }
    }


    // un simple EMPLOYEE ne doit pas pouvoir changer son propre role ou isActive (s'auto-promouvoir admin !). 
    // Il faut restreindre les champs modifiables selon le rôle de qui fait la requête.
    // A voir plus tard
    update = async (req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response, next: NextFunction) => {
        try {
            const result = await this.updateUserUseCase.execute(req.params.id, req.body, req.user!);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            await this.deleteUserUseCase.execute(
                req.params.id,
                req.user!
            );
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}