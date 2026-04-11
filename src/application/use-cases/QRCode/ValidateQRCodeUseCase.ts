import { ILocationRepository } from "@domain/repositories/ILocationRepository";
import { IQRCodeRepository } from "@domain/repositories/IQRCodeRepository";
import { GeoLocation } from "@domain/value-objects/GeoLocation";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { ValidationError } from "@shared/errors/ValidationError";

export class ValidateQRCodeUseCase {
    constructor(
        private readonly qrCodeRepository: IQRCodeRepository,
        private readonly locationRepository : ILocationRepository,
    ){}

    async execute(
        code: string, 
        latitude: number, 
        longitude: number, 
        employeeId: string, 
        companyId: string
    ): Promise<boolean> {
        // 1. Chercher QR Code par code
        const qrCode = await this.qrCodeRepository.findByCode(code);
        if(!qrCode) throw new NotFoundError('QR Code not found');

        // 2. Vérifier isActive + expiresAt
        if(!qrCode.isActive || qrCode.expiresAt < new Date()) {
            throw new ValidationError('QR Code is not valid');
        }

        // 3. Chercher la Location liée
        const location = await this.locationRepository.findById(qrCode.locationId, companyId);
        if(!location) throw new NotFoundError('Location not found');

        // 4. Vérifier géolocalisation avec GeoLocation value object
        const employeeLocation = new GeoLocation(latitude, longitude)
        const locationCenter = new GeoLocation(location.latitude, location.longitude)
        const isWithinRadius = employeeLocation.isWithinRadius(locationCenter, location.radius)

        if(!isWithinRadius) {
            throw new ValidationError('Employee is not within the location radius');
        }

        return true; // QR Code is valid




    }
}