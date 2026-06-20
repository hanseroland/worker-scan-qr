import { GenerateQRCodeUseCase } from "@application/use-cases/QRCode/GenerateQRCodeUseCase"
import { RotateQRCodeUseCase } from "@application/use-cases/QRCode/RotateQRCodeUseCase"
import { ValidateQRCodeUseCase } from "@application/use-cases/QRCode/ValidateQRCodeUseCase"
import { NextFunction, Request, Response } from "express"



export class QRCodeController {

    constructor(
        private generateQRCodeUseCase: GenerateQRCodeUseCase,
        private rotateQRCodeUseCase: RotateQRCodeUseCase,
        private validateQRCodeUseCase: ValidateQRCodeUseCase
    ) { }


    generate = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error)
        }
    }

    rotate = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error)
        }
    }

    validate = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error)
        }
    }



}