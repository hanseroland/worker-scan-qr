import { CreatePointageEventUseCase } from "@application/use-cases/PointageEvent/CreatePointageEventUseCase"
import { GetPointageEventsByEmployeeUseCase } from "@application/use-cases/PointageEvent/GetPointageEventsByEmployeeUseCase"
import { NextFunction, Request, Response } from "express"


export class PointageEventController {

    constructor(
        private createPointageEventUseCase: CreatePointageEventUseCase,
        private getPointageEventsByEmployeeUseCase: GetPointageEventsByEmployeeUseCase,

    ) { }


    scan = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error)
        }
    }

    getByEmployee = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error)
        }
    }



}