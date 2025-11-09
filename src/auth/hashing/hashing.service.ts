import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(password: string): Promise<string>;
  abstract compare(
    password: Buffer<ArrayBufferLike>,
    encrypted: string,
  ): boolean;
}
