import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AUTH_TYPE } from '../../constants';

@Injectable()
export class BasicAuthGuard extends AuthGuard(AUTH_TYPE.BASIC) {}
