import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

@Injectable()
export class BcryptService implements HashingService {
  async hash(password: string) {
    const salt = randomBytes(16);

    const hashed: Buffer<ArrayBufferLike> | undefined = await new Promise(
      (resolve, reject) =>
        scrypt(password, salt, 64, (err, res) => {
          if (err) {
            return void reject();
          }
          resolve(res);
        }),
    );

    if (!hashed) throw new Error('Failed to hash a password');
    return hashed.toString('base64');
  }

  compare(password: Buffer<ArrayBufferLike>, encrypted: string) {
    return timingSafeEqual(password, Buffer.from(encrypted, 'base64'));
  }
}
