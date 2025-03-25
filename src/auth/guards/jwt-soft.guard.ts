import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AUTH_TYPE } from '../../constants';

@Injectable()
export class JwtSoftGuard extends AuthGuard(AUTH_TYPE.JWT_SOFT) {}
