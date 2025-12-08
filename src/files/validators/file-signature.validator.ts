import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import magicBytes from 'magic-bytes.js';

export class FileSignature extends FileValidator {
  constructor() {
    super({});
  }
  isValid(file: Express.Multer.File): boolean {
    const fileSignature = magicBytes(file.buffer).map((file) => file.mime);
    if (!fileSignature.length) return false;

    const isMatch = fileSignature.includes(file.mimetype);
    if (!isMatch) return false;
    return true;
  }
  buildErrorMessage(file: any): string {
    throw new Error('Method not implemented.');
  }
}
