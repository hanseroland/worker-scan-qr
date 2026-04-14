import { CreateCompanyUseCase } from "@application/use-cases/company/CreateCompanyUseCase";
import { DeleteCompanyUseCase } from "@application/use-cases/company/DeleteCompanyUseCase";
import { GetAllCompaniesUseCase } from "@application/use-cases/company/GetAllCompaniesUseCase";
import { GetCompanyUseCase } from "@application/use-cases/company/GetCompanyUseCase";
import { UpdateCompanyUseCase } from "@application/use-cases/company/UpdateCompanyUseCase";
import { CreateCompanyDTO, UpdateCompanyDTO } from "@shared/types/dto.types";
import { NextFunction,Request,Response} from "express";

export class CompanyController {
    constructor(
        private createCompanyUseCase: CreateCompanyUseCase,
        private getCompanyUseCase: GetCompanyUseCase,
        private getAllCompaniesUseCase: GetAllCompaniesUseCase,
        private updateCompanyUseCase: UpdateCompanyUseCase,
        private deleteCompanyUseCase: DeleteCompanyUseCase
    ){}

    create = async (req: Request<{}, {}, CreateCompanyDTO>, res: Response, next: NextFunction) => {
      try {
      const company = await this.createCompanyUseCase.execute(req.body)
      res.status(201)
        .json(
            { 
                success: true, 
                data: company 
            })
    } catch (error) {
      next(error)
    }
   }

   getById = async (req: Request<{id:string}>, res: Response, next: NextFunction) => {
    try {
        const company = await this.getCompanyUseCase.execute(req.params.id);
        res.status(200).json(
            {
                success:true,
                data:company
            }
        )
    } catch (error) {
        next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const companies = await this.getAllCompaniesUseCase.execute();
          res.status(200).json(
            {
                success:true,
                data:companies
            }
          )
        } catch (error) {
            next(error)
        }
  }

  update = async (req: Request<{id:string}, {}, UpdateCompanyDTO>, res: Response, next: NextFunction)=>{
    try {
        const company = await this.updateCompanyUseCase.execute(req.params.id,req.body);
         res.status(200).json(
            {
                success:true,
                data:company
                
            }
          )
    } catch (error) {
        next(error)
    }
  }

  delete = async (req: Request<{id:string}>, res: Response, next: NextFunction) => {
    try {
        await this.deleteCompanyUseCase.execute(req.params.id);
         res.status(204).send(
            {
                success:true,
            }
          )
    } catch (error) {
        next(error)
    }
  }
}