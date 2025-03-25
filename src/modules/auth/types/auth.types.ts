export interface AuthUserDbModel {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface AuthUserClientModel {
  userId: string;
  login: string;
  email: string;
}

export class CustomJwtPayload {
  userId: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
}
