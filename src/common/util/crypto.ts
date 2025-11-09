import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'node:crypto';

@Injectable()
export class CryptoUtils {
  public async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64');

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
}
