import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(
    password: string,
    defaultSalt?: string,
  ): Promise<{ hashedPassword: string; salt: string }>;
  abstract compare(password: string, encrypted: string): boolean;
}
