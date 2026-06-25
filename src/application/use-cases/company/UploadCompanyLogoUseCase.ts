import { ICompanyRepository } from "@domain/repositories/ICompanyRepository";
import { IUploadService } from "@domain/services/IUploadService";
import { UserRole } from "@shared/enums";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class UploadCompanyLogoUseCase {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly  uploadService: IUploadService
    ){}

    async execute(
        companyId:string, 
        filePath:string,
        requestingUser: { id: string; role: UserRole; companyId: string | null }
    ): Promise<string>{

        const isSuperAdmin = requestingUser.role === UserRole.SUPER_ADMIN;
        const isCompanyAdminOwner = requestingUser.role === UserRole.COMPANY_ADMIN && requestingUser.companyId === companyId;

        if (!isSuperAdmin && !isCompanyAdminOwner) {
            throw new AuthError("Access denied, only admin");
        }

        // 1. Vérifier que la comapny existe
        const companyExists = await this.companyRepository.findById(companyId);
        if(!companyExists) throw new NotFoundError("Company not found");

        // 2. supprimer l'ancien logo
        if (companyExists.logo) {
            await this.uploadService.deleteImage(companyExists.logo);
        }

        // 3. Upload nouveau logo
        const logoUrl = await this.uploadService.uploadImage(filePath);

        // 4. Update entity
        companyExists.logo = logoUrl;

        await this.companyRepository.update(companyExists);

        return logoUrl;


    }


}