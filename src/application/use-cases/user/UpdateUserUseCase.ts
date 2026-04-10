import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { SafeUserDTO } from "@shared/types/dto.types";

export class UpdateUserCase {
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(id:string, companyId:string, dto:SafeUserDTO): Promise<User>{

        // 1. Regarder si l'utilisateur existe
        const userExists = await this.userRepository.findById(id, companyId);
        if(!userExists) throw new NotFoundError('User not found');

        // 2. Mettre à jour les champs modifiables
        userExists.role = dto.role;

        // 3. Enregistrer les modifications
        await this.userRepository.update(userExists);

        // 4. Retourner l'utilisateur mis à jour
        return userExists;

        
        }
}