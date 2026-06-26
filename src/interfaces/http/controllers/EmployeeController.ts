import { CreateEmployeeUseCase } from "@application/use-cases/employee/CreateEmployeeUseCase";
import { DesactivateEmployeeUseCase } from "@application/use-cases/employee/DesactivateEmployeeUseCase";
import { GetAllEmployeesUseCase } from "@application/use-cases/employee/GetAllEmployeesUseCase";
import { GetEmployeeUseCase } from "@application/use-cases/employee/GetEmployeeUseCase";
import { UpdateEmployeeUseCase } from "@application/use-cases/employee/UpdateEmployeeUseCase";
import { UploadEmployeePictureUseCase } from "@application/use-cases/employee/UploadEmployeePictureUseCase";
import { UserRole } from "@shared/enums";
import { AuthError } from "@shared/errors/AuthError";
import { ValidationError } from "@shared/errors/ValidationError";
import {CreateEmployeeDTO, UpdateEmployeeDTO } from "@shared/types/dto.types";
import { NextFunction,Request,Response} from "express";

export class EmployeeController {
    constructor(
        private createEmployeeUseCase: CreateEmployeeUseCase,
        private desactivateEmployeeUseCase: DesactivateEmployeeUseCase,
        private getEmployeeUseCase: GetEmployeeUseCase,
        private getAllEmployeeUseCase: GetAllEmployeesUseCase,
        private updateEmployeeUseCase: UpdateEmployeeUseCase,
        private uploadEmployeePictureUseCase: UploadEmployeePictureUseCase
    ){}

    create = async (req: Request<{}, {}, CreateEmployeeDTO>, res: Response, next: NextFunction) => {
      try {

        const result = await this.createEmployeeUseCase.execute(req.body,req.user!);
        res.status(201)
            .json(
                { 
                    success: true, 
                    data: result 
                })
    } catch (error) {
      next(error)
    }
   }

   getById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {

        // 1. Paramètre route
        const id = req.params.id;

        // 2. Use case
        const result = await this.getEmployeeUseCase.execute(id,req.user!);

        // 3. Reponse
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

  getAll = async (req: Request<{companyId:string}>, res: Response, next: NextFunction) => {
        try {
          const companyId = req.query.companyId || req.user?.companyId || undefined;
          const result = await this.getAllEmployeeUseCase.execute(companyId as string,req.user!);
          res.status(200).json(
            {
                success:true,
                data:result
            }
          )
        } catch (error) {
            next(error)
        }
  }

   uploadPicture = async (req: Request<{id:string}, {}, {}>, res: Response, next: NextFunction) => {
    try {

        if (!req.file) {
            throw new ValidationError("No file uploaded");
        }

        const id = req.params.id;
        const filePath = req.file.path;

        const logoUrl = await this.uploadEmployeePictureUseCase.execute(
            id,
            filePath,
            req.user!
        );
        return res.status(200).json({ data: logoUrl });
    } catch (error) {
        next(error);
    }
}

  update = async (req: Request<{id:string}, {}, UpdateEmployeeDTO>, res: Response, next: NextFunction)=>{
    try {
        /*const companyId = req.user?.companyId;

        if (!companyId) {
                return next(new AuthError("Unauthorized"));
        }*/
        
        const id = req.params.id;

        const result = await this.updateEmployeeUseCase.execute(
            id,
            req.body,
            req.user!
        );
         res.status(200).json(
            {
                success:true,
                data:result
                
            }
          )
    } catch (error) {
        next(error)
    }
  }

  delete = async (req: Request<{id:string}>, res: Response, next: NextFunction) => {
    try {
        
        const id = req.params.id;
        await this.desactivateEmployeeUseCase.execute(id,req.user!);
         res.status(204).send()
    } catch (error) {
        next(error)
    }
  }
}