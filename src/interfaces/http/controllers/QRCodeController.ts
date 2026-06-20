import { GenerateQRCodeUseCase } from "@application/use-cases/QRCode/GenerateQRCodeUseCase"
import { RotateQRCodeUseCase } from "@application/use-cases/QRCode/RotateQRCodeUseCase"
import { ValidateQRCodeUseCase } from "@application/use-cases/QRCode/ValidateQRCodeUseCase"
import { AuthError } from "@shared/errors/AuthError"
import { NextFunction, Request, Response } from "express"


interface ValidateQRCodeBody {
    code: string;
    latitude: number;
    longitude: number;
}

export class QRCodeController {

    constructor(
        private generateQRCodeUseCase: GenerateQRCodeUseCase,
        private rotateQRCodeUseCase: RotateQRCodeUseCase,
        private validateQRCodeUseCase: ValidateQRCodeUseCase
    ) { }


    generate = async (req: Request<{}, {}, { locationId: string }>, res: Response, next: NextFunction) => {
        try {
            const companyId = req.user?.companyId
            if (!companyId) {
                return next(new AuthError("Unauthorized"));
            }

            const { locationId } = req.body

            const result = await this.generateQRCodeUseCase.execute(locationId, companyId);

            return res.status(201).json({
                sucess:true,
                data:result
            });


        } catch (error) {
            next(error)
        }
    }

    rotate = async (req: Request<{}, {}, { locationId: string }>, res: Response, next: NextFunction) => {
        try {
            const companyId = req.user?.companyId
            if (!companyId) {
                return next(new AuthError("Unauthorized"));
            }

            const { locationId } = req.body

            const result = await this.rotateQRCodeUseCase.execute(locationId, companyId);

            return res.status(200).json({
                success:true,
                data:result
            });


        } catch (error) {
            next(error)
        }
    }

    validate = async (req: Request<{}, {}, ValidateQRCodeBody>, res: Response, next: NextFunction) => {
        try {

            const companyId = req.user?.companyId;
            if (!companyId) {
                return next(new AuthError("Unauthorized: Missing company context"));
            }

            const { code, latitude, longitude } = req.body;

            // Exécution de la validation (renvoie un booléen ou lève une ValidationError/NotFoundError)
            const isValid = await this.validateQRCodeUseCase.execute(
                code,
                latitude,
                longitude,
                companyId
            );

            return res.status(200).json({success:true, valid: isValid });
        } catch (error) {
            next(error)
        }
    }



}