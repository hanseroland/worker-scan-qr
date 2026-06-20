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
              const companyId = req.user?.companyId;
              const employeeId = req.user?.employeeId;

              const { qrCode, latitude, longitude } = req.body;

              if (!companyId || !employeeId) {
                return res.status(401).json({ message: "Unauthorized: Missing context" });
              }

              const dto: CreatePointageEventDTO = {
                companyId,
                employeeId,
                qrCode,
                latitude,
                longitude
            };

            const result = await this.createPointageEventUseCase.execute(dto);

            return res.status(201).json({
                success:true,
                data:result
            });



        } catch (error) {
            next(error)
        }
    }

    getByEmployee = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const companyId = req.user?.companyId;
            const employeeId = req.user?.employeeId;

            if (!companyId || !employeeId) {
                return res.status(401).json({ message: "Unauthorized: Missing context" });
            }

            const result = await this.getPointageEventsByEmployeeUseCase.execute(employeeId, companyId);

            return res.status(200).json({
                success:true,
                data:result
            });
        } catch (error) {
            next(error)
        }
    }



}