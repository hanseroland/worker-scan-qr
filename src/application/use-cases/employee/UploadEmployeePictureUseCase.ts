import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { IUploadService } from "@domain/services/IUploadService";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class UploadEmployeePictureUseCase {
    constructor(
        private readonly employeeRepository: IEmployeeRepository,
        private readonly  uploadService: IUploadService
        
    ){}

    async execute(
        employeeId: string,
        companyId: string,
        filePath: string
    ): Promise<string>{

        // 1. Vérifier employee
        const employeeExists = await this.employeeRepository.findById(
            employeeId,
            companyId
        );

        if (!employeeExists) throw new NotFoundError("Employee not found");

        // 2. Supprimer ancienne image
        if (employeeExists.picture) {
        await this.uploadService.deleteImage(employeeExists.picture);
        }

        // 3. Upload nouvelle image
        const pictureUrl = await this.uploadService.uploadImage(filePath);

        // 4. Update entity
        employeeExists.picture = pictureUrl;

        await this.employeeRepository.update(employeeExists);

        return pictureUrl;


    }
}