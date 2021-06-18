import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

@Injectable()
export class BcryptService {
  async bcryptGenSaltAsync() {
    return await bcrypt.genSalt(SALT_ROUNDS);
  }

  async hashedPasswordAsync(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async comparePasswordAsync(password: string, storedPasswordHash: string) {
    return await bcrypt.compare(password, storedPasswordHash);
  }
}
