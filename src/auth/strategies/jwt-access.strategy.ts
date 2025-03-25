import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AUTH_TYPE } from '../../constants';
import { AuthService } from '../../modules/auth/services/auth.service';
import { CustomJwtPayload } from '../../modules/auth/types/auth.types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  AUTH_TYPE.JWT_ACCESS,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: CustomJwtPayload): { userId: string } {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = this.authService.getUserIdByToken(token);
      return { userId };
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
