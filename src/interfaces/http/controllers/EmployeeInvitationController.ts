import { AcceptInvitationUseCase } from "@application/use-cases/EmployeeInvitation/AcceptInvitationUseCase";
import { CreateInvitationUseCase } from "@application/use-cases/EmployeeInvitation/CreateInvitationUseCase";
import { AcceptInvitationDTO, CreateEmployeeInvitationDTO } from "@shared/types/dto.types";
import { NextFunction, Request, Response } from "express";


export class EmployeeInvitationController {

    constructor(
        private acceptInvitationUseCase: AcceptInvitationUseCase,
        private createInvitationUseCase: CreateInvitationUseCase
    ) { }


    create = async (req: Request<{}, {}, CreateEmployeeInvitationDTO>, res: Response, next: NextFunction) => {
        try {
            await this.createInvitationUseCase.execute(req.body);
            res.status(201).json({ success: true, message: 'Invitation sent successfully' })

        } catch (error) {
            next(error)
        }
    }

    accept = async (req: Request<{}, {}, AcceptInvitationDTO>, res: Response, next: NextFunction) => {
        try {
            await this.acceptInvitationUseCase.execute(req.body)
            res.status(200).json({ success: true, message: 'Invitation accepted' })
        } catch (error) {
            next(error)
        }
    }


}