// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-custom';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { Request } from 'express';
// import { AUTH_TYPE } from '../../constants';
// import { AuthService } from '../../modules/auth/services/auth.service';
//
// @Injectable()
// export class RefreshTokenStrategy extends PassportStrategy(
//   Strategy,
//   AUTH_TYPE.REFRESH_TOKEN,
// ) {
//   constructor(private readonly authService: AuthService) {
//     super();
//   }
//
//   async validate(req: Request): Promise<{ userId: string }> {
//     const refreshToken = req.cookies?.refreshToken;
//
//     if (!refreshToken) {
//       throw new UnauthorizedException('Refresh token not found');
//     }
//
//     const isValid = await this.authService.validateRefreshToken(refreshToken);
//     if (!isValid) {
//       throw new UnauthorizedException('Refresh token is invalid or expired');
//     }
//
//     const payload = await this.authService.getTokenPayload(refreshToken);
//     const userId = payload?.userId;
//
//     if (!userId) {
//       throw new UnauthorizedException('User ID not found in token');
//     }
//
//     return { userId };
//   }
// }
