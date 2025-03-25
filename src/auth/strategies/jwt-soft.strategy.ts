import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AUTH_TYPE } from '../../constants';
import { CustomJwtPayload } from '../../modules/auth/types/auth.types';
import { AuthService } from '../../modules/auth/services/auth.service';

@Injectable()
export class JwtSoftStrategy extends PassportStrategy(
  Strategy,
  AUTH_TYPE.JWT_SOFT,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: CustomJwtPayload): { userId: string | null } {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = token ? this.authService.getUserIdByToken(token) : null;
      return { userId };
    } catch {
      return { userId: null };
    }
  }
}
