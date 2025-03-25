import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from '../repositories/auth.repository';
import { EmailService } from '../../../services/email/email-service';
import { UserRepository } from '../../users/repositories/user.repository';
import { CustomJwtPayload } from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepositories: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { loginOrEmail, password } = req.body;

    const user = await this.authRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return res.sendStatus(401);

    const isValid = await this.userRepositories.isPasswordCorrect(
      user,
      password,
    );

    if (!isValid) return res.sendStatus(401);

    // const deviceId = uuidv4();

    const accessToken = this.createAccessToken(user._id.toString());
    // const refreshToken = this.createRefreshToken(user._id.toString(), deviceId);
    //
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });

    return res.status(200).json({ accessToken });
  }

  // async refreshToken(req: Request, res: Response): Promise<Response> {
  //   const refreshToken = req.cookies.refreshToken;
  //
  //   const isValid = await this.authRepository.isTokenRevoked(refreshToken);
  //   if (isValid) return res.sendStatus(401);
  //
  //   const payload = await this.getTokenPayload(refreshToken);
  //   if (!payload?.userId) return res.sendStatus(401);
  //
  //   const newAccessToken = this.createAccessToken(payload.userId);
  //   const newRefreshToken = this.createRefreshToken(payload.userId);
  //
  //   await this.authRepository.revokeRefreshToken(payload.userId, refreshToken);
  //
  //   res.cookie('refreshToken', newRefreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //   });
  //
  //   return res.status(200).json({ accessToken: newAccessToken });
  // }

  // async logout(req: Request, res: Response): Promise<Response> {
  //   const refreshToken = req.cookies.refreshToken;
  //   const payload = await this.getTokenPayload(refreshToken);
  //
  //   if (!payload?.userId) return res.sendStatus(401);
  //
  //   await this.authRepository.revokeRefreshToken(payload.userId, refreshToken);
  //
  //   return res.sendStatus(204);
  // }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const isCreated = await this.authRepository.register(req.body);
      if (!isCreated) return res.sendStatus(500);
      return res.sendStatus(204);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async resendConfirmationEmail(
    email: string,
    res: Response,
  ): Promise<Response> {
    try {
      await this.emailService.resendConfirmationEmail(email);
      return res.sendStatus(204);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async confirmRegistration(code: string, res: Response): Promise<Response> {
    try {
      const isConfirmed = await this.authRepository.confirmRegistration(code);
      if (!isConfirmed) return res.sendStatus(500);
      return res.sendStatus(204);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async sendPasswordRecovery(email: string, res: Response): Promise<Response> {
    try {
      await this.emailService.sendPasswordRecovery(email);
      return res.sendStatus(204);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async confirmNewPassword(
    newPassword: string,
    recoveryCode: string,
    res: Response,
  ): Promise<Response> {
    try {
      const isUpdated = await this.authRepository.confirmNewPassword(
        newPassword,
        recoveryCode,
      );
      if (!isUpdated) return res.sendStatus(500);
      return res.sendStatus(204);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async getMe(userId: string) {
    const user = await this.authRepository.getUserById(userId);

    return user || null;
  }

  createAccessToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_SECRET!, expiresIn: '10m' },
    );
  }

  createRefreshToken(userId: string, deviceId: string): string {
    return this.jwtService.sign(
      { userId, deviceId },
      { secret: process.env.JWT_SECRET!, expiresIn: '30m' },
    );
  }

  async getTokenPayload(token: string): Promise<CustomJwtPayload | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET!,
      });
    } catch {
      return null;
    }
  }

  getUserIdByToken(token?: string): string {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const decoded = this.jwtService.verify<CustomJwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded?.userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return decoded.userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
