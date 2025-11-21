import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

console.log(randomBytes(16).toString('base64'), 'yyy');

@Injectable()
export class BcryptService implements HashingService {
  constructor(private readonly config: ConfigService) {}

  async hash(
    password: string,
    defaultSalt?: string,
  ): Promise<{ hashedPassword: string; salt: string }> {
    const salt = defaultSalt
      ? Buffer.from(defaultSalt, 'base64')
      : randomBytes(16);

    const saltWithPepper = Buffer.concat([
      salt,
      Buffer.from(this.config.get('PEPPER')),
    ]);

    const hashed: Buffer<ArrayBufferLike> | undefined = await new Promise(
      (resolve, reject) =>
        scrypt(password, saltWithPepper, 64, (err, res) => {
          if (err) {
            return void reject();
          }
          resolve(res);
        }),
    );

    if (!hashed) throw new Error('Failed to hash a password');

    return {
      hashedPassword: hashed.toString('base64'),
      salt: salt.toString('base64'),
    };
  }

  compare(password: string, encrypted: string) {
    return timingSafeEqual(
      Buffer.from(password, 'base64'),
      Buffer.from(encrypted, 'base64'),
    );
  }
}
