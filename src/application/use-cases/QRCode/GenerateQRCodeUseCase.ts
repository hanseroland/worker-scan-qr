import { QRCode } from "@domain/entities/QRCode";
import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { IQRCodeRepository } from "@domain/repositories/IQRCodeRepository";
import { ICryptoService } from "@domain/services/ICryptoService";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { randomUUID } from "crypto";

export class GenerateQRCodeUseCase {
    constructor(
        private readonly qrCodeRepository : IQRCodeRepository,
        private readonly locationRepository: ILocationRepository,
        private readonly cryptoService: ICryptoService

    ){}

    async execute(locationId:string,companyId: string): Promise<QRCode>{
        // 1. Vérifier que le lieux existe et appartient à l'entreprise
        const existingLocations = await this.locationRepository.findById(locationId,companyId);
        if(!existingLocations) throw new NotFoundError('Location not found');

        // 2. Désactiver les QR codes actifs pour ce lieu
        await this.qrCodeRepository.deactivateAllByLocation(locationId,companyId);

        // 3. Générer un nouveau QR code avec cryptoService.generateQRCode()
        const newQRCode = this.cryptoService.generateQRCode(locationId,companyId, Date.now());

        // 4. expiresAt = now + config.qrcode.rotationInterval 30 secondes
        const expiresAt = new Date(Date.now() + 30 * 1000); // 30 secondes

        // 5. // 5. Sauvegarder et retourner
        const qrCodeEntity = new QRCode(
            randomUUID(),
            companyId,
            locationId,
            newQRCode,
            expiresAt,
            true
        )

        await this.qrCodeRepository.save(qrCodeEntity);

        return qrCodeEntity;
    }
}