export interface IUploadService {
  uploadImage(filePath: string): Promise<string> // retourne l'URL
  deleteImage(imageUrl: string): Promise<void>
}