import { Injectable, StreamableFile } from '@nestjs/common';
import { StorageService } from './storage.service';
import {
  createReadStream,
  createWriteStream,
  mkdirp,
  readdir,
  remove,
  pathExists,
} from 'fs-extra';
import { join } from 'node:path';
import { BASE_PATH } from '../util/file.constants';

@Injectable()
export class FseService implements StorageService {
  async saveFile(path: string, file: Express.Multer.File) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const ws = createWriteStream(join(BASE_PATH, path, file.originalname));
    file.stream.pipe(ws).on('finish', () => {
      resolve(true);
    });
    await promise;
  }
  async createDir(path: string, file: any): Promise<void> {
    const fullPath = join(BASE_PATH, path);
    mkdirp(fullPath);
  }
  getFile(path: string) {
    const fullPath = join(BASE_PATH, path);
    const rs = createReadStream(fullPath);
    return new StreamableFile(rs);
  }
  getDirFileNames(path: string) {
    const fullPath = join(BASE_PATH, path);
    return readdir(fullPath);
  }
  async getFilesCount(path: string) {
    const fileNames = await this.getDirFileNames(path);
    return fileNames.length;
  }
  async delete(path: string) {
    const fullPath = join(BASE_PATH, path);
    return remove(fullPath);
  }
  async validatePath(path: string) {
    const fullPath = join(BASE_PATH, path);
    if (!(await pathExists(fullPath))) {
      throw new Error('Path not found');
    }
  }
}
