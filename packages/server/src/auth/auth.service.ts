import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { Config } from '../common';
import { UsersService } from '../users';

const ThreeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  signJWT(subject: string): Promise<string> {
    const now = Date.now();
    const payload: JwtPayload = {
      exp: now + ThreeDaysInMilliseconds,
      iat: now,
      nbf: now,
      sub: subject,
      iss: 'gaia-project',
    };

    return new Promise<string>((resolve, reject) => {
      sign(payload, Config.sessionSecret, {}, (error, token) => {
        if (error) reject(error);
        else resolve(token!);
      });
    });
  }

  verifyJWT(jwt: string): Promise<string> {
    return new Promise((resolve) => {
      resolve('');
    });
  }
}
