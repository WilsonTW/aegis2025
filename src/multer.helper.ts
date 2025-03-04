import { Request } from 'express';
import { join } from 'path';

export class MulterHelper {

  public static destination(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ): void {
    console.log('MulterHelper destination - ', join(__dirname, '../../public/upload/'));
    callback(null, join(__dirname, '../../public/upload/'));
  }

  /*
  public static filenameHandler(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ): void {
    const { originalname } = file;
    const timestamp = new Date().toISOString();
    callback(null, `${timestamp}-${originalname}`);
  }
  */

}