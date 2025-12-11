import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export abstract class StorageService {
  abstract saveFile(path: string, file: Express.Multer.File): Promise<void>;
  abstract createDir(path: string, file): Promise<void>;
  abstract getFile(path: string): StreamableFile;
  abstract getDirFileNames(path: string): Promise<string[]>;
  abstract getFilesCount(path: string): Promise<number>;
  abstract delete(path: string): Promise<void>;
  abstract validatePath(path: string): Promise<void>;
  abstract validateFileCount(count: number, max: number): void;
  abstract genUniqueFileName(filename: string): string;
}
