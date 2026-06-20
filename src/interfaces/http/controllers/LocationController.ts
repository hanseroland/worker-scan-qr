import { CreateLocationUseCase } from "@application/use-cases/location/CreateLocationUseCase"
import { DeleteLocationUseCase } from "@application/use-cases/location/DeleteLocationUseCase"
import { GetAllLocationsUseCase } from "@application/use-cases/location/GetAllLocationsUseCase"
import { GetLocationUseCase } from "@application/use-cases/location/GetLocationUseCase"
import { UpdateLocationUseCase } from "@application/use-cases/location/UpdateLocationUseCase"
import { UserRole } from "@shared/enums"
import { AuthError } from "@shared/errors/AuthError"
import { ValidationError } from "@shared/errors/ValidationError"
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
            const result = await this.createLocationUseCase.execute(req.body);
            res.status(201).json({
                success: true,
                message: 'Location create successfully',
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    getById = async (req: Request<{ locationId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const { locationId } = req.params;
            const companyId = req.user?.companyId;

            if (!companyId) {
                return next(new AuthError("Unauthorized"));
            }

            const result = await this.getLocationUseCase.execute(locationId, companyId);
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

            const user = req.user;

            const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

            // CompanyAdmin => toujours sa propre company
            // SuperAdmin => peut consulter une company précise via query param
            const companyId = isSuperAdmin
                ? req.query.companyId as string
                : user?.companyId;

            if (!companyId) {
                return next(new ValidationError("companyId is required"));
            }
            const result = await this.getAllLocationsUseCase.execute(companyId);
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

    update = async (req: Request<{ locationId: string }, {}, UpdateLocationDTO>, res: Response, next: NextFunction) => {
        try {
            const companyId = req.user?.companyId;

            if (!companyId) {
                return next(new AuthError("Unauthorized"));
            }

            const locationId = req.params.locationId;

            const result = await this.updateLocationUseCase.execute(
                locationId,
                companyId,
                req.body
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

    delete = async (req: Request<{ locationId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const companyId = req.user?.companyId;

            if (!companyId) {
                return next(new AuthError("Unauthorized"));
            }

            const locationId = req.params.locationId;
            await this.deleteLocationUseCase.execute(locationId, companyId);
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }


}