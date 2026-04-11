import { IPointageEventRepository } from "@domain/repositories/IPointageEventRepository";

export class CreatePointageEventUseCase {
    constructor(
        private readonly pointageEventRepository: IPointageEventRepository
    ){}

   // 1. Vérifier que l'employé existe
   // 2. Valider le QR Code + géolocalisation via ValidateQRCodeUseCase
   // 3. Vérifier l'ordre des événements (CHECK_IN avant CHECK_OUT etc.)
   // 4. Créer l'entité PointageEvent
   // 5. Sauvegarder et retourner

    
}