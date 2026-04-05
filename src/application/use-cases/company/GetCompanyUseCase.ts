import { Company } from "@domain/entities/Company";
import { ICompanyRepository } from "@domain/repositories/ICompanyRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class GetCompanyUseCase {
    constructor(private readonly companyRepository: ICompanyRepository){}

    async execute(id:string): Promise<Company>{
        const comapny = await this.companyRepository.findById(id);
        if(!comapny){
            throw new NotFoundError('Company not found');
        }
        return comapny;
    }

}