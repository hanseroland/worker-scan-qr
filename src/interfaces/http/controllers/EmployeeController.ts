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
        private uploadCompanyPictureUseCase: UploadEmployeePictureUseCase
    ){}

    create = async (req: Request<{}, {}, CreateEmployeeDTO>, res: Response, next: NextFunction) => {
      try {

        // 1. Déterminer le companyId cible
        const companyId = req.user?.role === 'SUPER_ADMIN' 
            ? req.body.companyId 
            : req.user?.companyId;

        // 2. Validation stricte : Si on n'a pas de companyId à ce stade, c'est une erreur
        if (!companyId) {
            throw new ValidationError("Company should be specify to create an employee.");
        }

        // 3. Construction du payload garanti
        const payload: CreateEmployeeDTO = {
            ...req.body,
            companyId: companyId 
        };

        const result = await this.createEmployeeUseCase.execute(payload);
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

   getById = async (req: Request<{employeeId: string}>, res: Response, next: NextFunction) => {
    try {

        // 1. Sécurité multi-tenant 
        const companyId = req.user?.companyId;

        if (!companyId) {
            return next(new AuthError("Unauthorized"));
        }

        // 2. Paramètre route
        const employeeId = req.params.employeeId;

        // 3. Use case
        const result = await this.getEmployeeUseCase.execute(employeeId,companyId);

        // 4. Reponse
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
        
          const { companyId: requestedId } = req.params;
                const user = req.user;
            
                const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
                const isOwner = user?.companyId === requestedId;
            
                if (!isSuperAdmin && !isOwner) {
                    return res.status(403).json({
                            success: false,
                            message: "Unauthorized access"
                         });
            }
          const companyId = req.params.companyId
          const result = await this.getAllEmployeeUseCase.execute(companyId);
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

   uploadPicture = async (req: Request<{employeeId:string}, {},{}>, res: Response, next: NextFunction) => {
        try {
            // Sécurité multi-tenant 
            const companyId = req.user?.companyId;

            if (!companyId) {
                return next(new AuthError("Unauthorized"));
            }

            if (!req.file) {
                throw new ValidationError("No file uploaded");
            }

            const employeeId = req.params.employeeId;
            const filePath = req.file.path;

            const logoUrl = await this.uploadCompanyPictureUseCase.execute(
                employeeId,
                companyId,
                filePath
            );
            return res.status(200).json({data:logoUrl});
        } catch (error) {
            next(error);
        }
    }

  update = async (req: Request<{employeeId:string}, {}, UpdateEmployeeDTO>, res: Response, next: NextFunction)=>{
    try {
        const companyId = req.user?.companyId;

        if (!companyId) {
                return next(new AuthError("Unauthorized"));
        }
        
        const employeeId = req.params.employeeId;

        const result = await this.updateEmployeeUseCase.execute(
            employeeId,
            companyId,
            req.body
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

  delete = async (req: Request<{employeeId:string}>, res: Response, next: NextFunction) => {
    try {
        const companyId = req.user?.companyId;

        if (!companyId) {
                return next(new AuthError("Unauthorized"));
        }
        
        const employeeId = req.params.employeeId;
        await this.desactivateEmployeeUseCase.execute(employeeId,companyId);
         res.status(204).send()
    } catch (error) {
        next(error)
    }
  }
}