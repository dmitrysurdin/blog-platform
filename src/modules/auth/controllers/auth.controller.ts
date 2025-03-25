import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAccessGuard } from '../../../auth/guards/jwt-access.guard';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { CodeDto } from '../dto/code.dto';
import { EmailDto } from '../dto/email.dto';
import { NewPasswordDto } from '../dto/new-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.body = dto;

    return this.authService.login(req, res);
  }

  // @UseGuards(RefreshTokenGuard)
  // @Post('refresh-token')
  // async refreshToken(@Req() req: Request, @Res() res: Response) {
  //   return this.authService.refreshToken(req, res);
  // }

  // @Post('logout')
  // async logout(@Req() req: Request, @Res() res: Response) {
  //   return this.authService.logout(req, res);
  // }

  @Post('registration')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.body = dto;
    return this.authService.register(req, res);
  }

  @Post('registration-email-resending')
  async resendConfirmationEmail(@Body() dto: EmailDto, @Res() res: Response) {
    return this.authService.resendConfirmationEmail(dto.email, res);
  }

  @Post('registration-confirmation')
  async confirmRegistration(@Body() dto: CodeDto, @Res() res: Response) {
    return this.authService.confirmRegistration(dto.code, res);
  }

  @Post('password-recovery')
  async sendPasswordRecovery(@Body() dto: EmailDto, @Res() res: Response) {
    return this.authService.sendPasswordRecovery(dto.email, res);
  }

  @Post('new-password')
  async confirmNewPassword(@Body() dto: NewPasswordDto, @Res() res: Response) {
    return this.authService.confirmNewPassword(
      dto.newPassword,
      dto.recoveryCode,
      res,
    );
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.getMe(req.user['userId']);
    if (!user) return res.sendStatus(401);
    return res.status(200).json(user);
  }
}
