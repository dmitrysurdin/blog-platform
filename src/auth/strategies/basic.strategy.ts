import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  validate(username: string, password: string): boolean {
    const expectedUsername = process.env.LOGIN;
    const expectedPassword = process.env.PASSWORD;

    if (username !== expectedUsername || password !== expectedPassword) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
