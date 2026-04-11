export class GeoLocation {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number
  ) {}

  distanceTo(other: GeoLocation): number {
    const R = 6371000 // rayon Terre en mètres
    const φ1 = this.latitude * Math.PI / 180
    const φ2 = other.latitude * Math.PI / 180
    const Δφ = (other.latitude - this.latitude) * Math.PI / 180
    const Δλ = (other.longitude - this.longitude) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // distance en mètres
  }

  isWithinRadius(center: GeoLocation, radius: number): boolean {
    return this.distanceTo(center) <= radius
  }
}