import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async saveBase64Image(base64: string, folder: string = 'uploads'): Promise<string> {
    
    if (base64.startsWith('http://') || base64.startsWith('https://')) {
        return base64;
      }

    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image format');
    }

    const mimeType = matches[1];
    const data = matches[2];
    const ext = mimeType.split('/')[1]; 
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    
    const folderPath = join(process.cwd(), folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const filePath = join(folderPath, fileName);

    
    writeFileSync(filePath, Buffer.from(data, 'base64'));

    
    return `${this.configService.get('APP_URL')}/${folder}/${fileName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    if (existsSync(filePath)) {
      unlinkSync(filePath); 
    }
  }
}