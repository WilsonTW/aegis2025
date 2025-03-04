import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UploadPipe implements PipeTransform<Express.Multer.File, Express.Multer.File> {

  transform(files: Express.Multer.File): Express.Multer.File {
    return files
  }

}