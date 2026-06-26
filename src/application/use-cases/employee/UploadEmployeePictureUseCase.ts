import { IEmployeeRepository } from "@domain/repositories/IEmployeeRepository";
import { IUploadService } from "@domain/services/IUploadService";
import { UserRole } from "@shared/enums";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class UploadEmployeePictureUseCase {
    constructor(
        private readonly employeeRepository: IEmployeeRepository,
        private readonly  uploadService: IUploadService
        
    ){}

    async execute(
        id: string,
        filePath: string,
        requestingUser: { id: string; role: UserRole; companyId: string | null, employeeId: string | null }
    ): Promise<string>{

        // 1. Vérifier employee
        const employeeExists = await this.employeeRepository.findById(id);
        if (!employeeExists) throw new NotFoundError("Employee not found");

        const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
        const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === employeeExists.companyId;
        const isSelf = requestingUser.role === UserRole.EMPLOYEE && requestingUser.employeeId === id;

        // Validation fine de la matrice de permissions
        if (!isSuperAdmin && !isCompanyAdminOwner && !isSelf) {
            throw new AuthError("You don't have permission to update this profile picture");
        }

        // 3. Supprimer ancienne image
        if (employeeExists.picture) {
        await this.uploadService.deleteImage(employeeExists.picture);
        }

        // 4. Upload nouvelle image
        const pictureUrl = await this.uploadService.uploadImage(filePath);

        // 5. Update entity
        employeeExists.picture = pictureUrl;

        await this.employeeRepository.update(employeeExists);

        return pictureUrl;


    }
}