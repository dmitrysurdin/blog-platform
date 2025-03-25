import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_TYPE } from '../../constants';

@Injectable()
export class JwtAccessGuard extends AuthGuard(AUTH_TYPE.JWT_ACCESS) {}
