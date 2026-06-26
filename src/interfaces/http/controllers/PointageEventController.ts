import { CreatePointageEventUseCase } from "@application/use-cases/PointageEvent/CreatePointageEventUseCase"
import { GetPointageEventsByEmployeeUseCase } from "@application/use-cases/PointageEvent/GetPointageEventsByEmployeeUseCase"
import { CreatePointageEventDTO } from "@shared/types/dto.types";
import { NextFunction, Request, Response } from "express"


export class PointageEventController {

    constructor(
        private createPointageEventUseCase: CreatePointageEventUseCase,
        private getPointageEventsByEmployeeUseCase: GetPointageEventsByEmployeeUseCase,

    ) { }


    scan = async (req: Request<{}, {}, Omit<CreatePointageEventDTO, 'employeeId' | 'companyId'>>, res: Response, next: NextFunction) => {
        try {
             
            const dto = {
                ...req.body,
                companyId: req.user!.companyId!,
                employeeId: req.user!.employeeId!
            }

            const result = await this.createPointageEventUseCase.execute(dto,req.user!);

            return res.status(201).json({
                success:true,
                data:result
            });
        } catch (error) {
            next(error)
        }
    }

    getByEmployee = async (req: Request<{employeeId:string}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const targetEmployeeId = req.params.employeeId || req.user!.employeeId!;
            const result = await this.getPointageEventsByEmployeeUseCase.execute(targetEmployeeId, req.user!);

            return res.status(200).json({
                success:true,
                data:result
            });
        } catch (error) {
            next(error)
        }
    }



}