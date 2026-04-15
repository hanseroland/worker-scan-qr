import { DeleteUserUseCase } from "@application/use-cases/user/DeleteUserUseCase";
import { GetAllUserUseCase } from "@application/use-cases/user/GetAllUserUseCase";
import { GetCompanyUsersUseCase } from "@application/use-cases/user/GetCompanyUsersUseCase";
import { GetUserUseCase } from "@application/use-cases/user/GetUserUseCase";
import { UpdateUserUseCase } from "@application/use-cases/user/UpdateUserUseCase";
import { UpdateUserDTO } from "@shared/types/dto.types";
import { NextFunction,Request,Response} from "express";

export class UserController {
    constructor(
        private getCompanyUsersUseCase: GetCompanyUsersUseCase,
        private getUserUseCase: GetUserUseCase,
        private getAllUserUseCase: GetAllUserUseCase,
        private updateUserUseCase: UpdateUserUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
    ){}

   
   getById = async (req: Request<{id:string}>, res: Response, next: NextFunction) => {
    try {
        const result = await this.getUserUseCase.execute(req.params.id);
        res.status(200).json(
            {
                success:true,
                data:result
            }
        );
    } catch (error) {
        next(error);
    }
  }

  getByCompanyId = async (req: Request<{companyId:string}>, res: Response, next: NextFunction) => {
    try {
        const result = await this.getCompanyUsersUseCase.execute(req.params.companyId);
        res.status(200).json(
            {
                success:true,
                data:result
            }
        );
    } catch (error) {
        next(error);
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this.getAllUserUseCase.execute();
          res.status(200).json(
            {
                success:true,
                data:result
            }
          );
        } catch (error) {
            next(error);
        }
  }

  
  update = async (req: Request<{id:string}, {}, UpdateUserDTO>, res: Response, next: NextFunction)=>{
    try {
        const result = await this.updateUserUseCase.execute(req.params.id,req.body);
         res.status(200).json(
            {
                success:true,
                data:result
                
            }
          );
    } catch (error) {
        next(error);
    }
  }

  delete = async (req: Request<{id:string}>, res: Response, next: NextFunction) => {
    try {
        await this.deleteUserUseCase.execute(req.params.id);
         res.status(204).send()
    } catch (error) {
        next(error)
    }
  }
}