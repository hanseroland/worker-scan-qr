import path from 'path';
import fs from 'fs';
import { IUploadService } from '@domain/services/IUploadService';

export class UploadService implements IUploadService {
  async uploadImage(filePath: string): Promise<string> {
    // Simulate file upload and return a URL
    const fileName = path.basename(filePath);
    return `/uploads/${fileName}`;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const filePath = path.join(__dirname, '../../../', imageUrl);
    await fs.promises.unlink(filePath);
  }
}
