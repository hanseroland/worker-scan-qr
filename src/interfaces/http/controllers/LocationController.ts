import { CreateLocationUseCase } from "@application/use-cases/location/CreateLocationUseCase"
import { DeleteLocationUseCase } from "@application/use-cases/location/DeleteLocationUseCase"
import { GetAllLocationsUseCase } from "@application/use-cases/location/GetAllLocationsUseCase"
import { GetLocationUseCase } from "@application/use-cases/location/GetLocationUseCase"
import { UpdateLocationUseCase } from "@application/use-cases/location/UpdateLocationUseCase"
import { CreateLocationDTO, UpdateLocationDTO } from "@shared/types/dto.types"
import { NextFunction, Request, Response } from "express"


export class LocationController {

    constructor(
        private createLocationUseCase: CreateLocationUseCase,
        private getLocationUseCase: GetLocationUseCase,
        private getAllLocationsUseCase: GetAllLocationsUseCase,
        private updateLocationUseCase: UpdateLocationUseCase,
        private deleteLocationUseCase: DeleteLocationUseCase

    ) { }


    create = async (req: Request<{}, {}, CreateLocationDTO>, res: Response, next: NextFunction) => {
        try {
            const result = await this.createLocationUseCase.execute(req.body,req.user!);
            res.status(201).json({
                success: true,
                message: 'Location create successfully',
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    getById = async (req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const id  = req.params.id;
            const result = await this.getLocationUseCase.execute(id, req.user!);
            res.status(200).json(
                {
                    success: true,
                    data: result
                }
            );

        } catch (error) {
            next(error)
        }
    }

    getAll = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

            const companyId = req.query.companyId || req.user?.companyId || undefined;

            const result = await this.getAllLocationsUseCase.execute(companyId as string, req.user!);
            res.status(200).json(
                {
                    success: true,
                    data: result
                }
            )

        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request<{ id: string }, {}, UpdateLocationDTO>, res: Response, next: NextFunction) => {
        try {           
            const result = await this.updateLocationUseCase.execute(
                req.params.id,
                req.body,
                req.user!
            );
            res.status(200).json(
                {
                    success: true,
                    data: result
                }
            )
        } catch (error) {
            next(error)
        }
    }

    delete = async (req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const locationId = req.params.id;
            await this.deleteLocationUseCase.execute(locationId, req.user!);
            res.status(204).send({success:true})
        } catch (error) {
            next(error)
        }
    }


}