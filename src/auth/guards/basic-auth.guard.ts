import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { GUARD_TYPE } from '../../constants';

@Injectable()
export class BasicAuthGuard extends AuthGuard(GUARD_TYPE.BASIC) {}
