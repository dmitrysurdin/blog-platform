import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { User } from '../../users/schemas/user.schema';
import { RegistrationUser } from '../schemas/registration-user-schema';
import { RevokedToken } from '../schemas/revoked-token.schema';
import { PasswordRecovery } from '../schemas/password-recovery.schema';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RegistrationUser.name)
    private registrationUserModel: Model<RegistrationUser>,
    @InjectModel(RevokedToken.name)
    private revokedTokenModel: Model<RevokedToken>,
    @InjectModel(PasswordRecovery.name)
    private passwordRecoveryModel: Model<PasswordRecovery>,
    private readonly userRepositories: UserRepository,
  ) {}

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .lean();
  }

  async findUserById(id: string) {
    return this.userModel.findById(id).lean();
  }

  async getUserById(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) return false;
    return {
      userId: user._id.toString(),
      login: user.login,
      email: user.email,
    };
  }

  async register({ login, email, password }) {
    const existingEmail = await this.registrationUserModel
      .findOne({ email })
      .lean();
    if (existingEmail) {
      throw {
        errorsMessages: [
          {
            field: 'email',
            message: 'User with this email is already registered',
          },
        ],
      };
    }

    const existingLogin = await this.registrationUserModel
      .findOne({ login })
      .lean();
    if (existingLogin) {
      throw {
        errorsMessages: [
          {
            field: 'login',
            message: 'User with this login is already registered',
          },
        ],
      };
    }

    const existingFinalLogin = await this.userRepositories.findByLogin(login);
    if (existingFinalLogin) {
      throw {
        errorsMessages: [
          { field: 'login', message: 'User with this login already exists' },
        ],
      };
    }

    const existingFinalEmail = await this.userRepositories.findByEmail(email);
    if (existingFinalEmail) {
      throw {
        errorsMessages: [
          { field: 'email', message: 'User with this email already exists' },
        ],
      };
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const user = new this.registrationUserModel({
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { hours: 1 }),
      isConfirmed: false,
    });

    await user.save();
    return user;
  }

  async findRegistrationUserByEmail(email: string) {
    return this.registrationUserModel.findOne({ email }).lean();
  }

  async updateConfirmationCodeById(id: string, newCode: string) {
    const result = await this.registrationUserModel.updateOne(
      { _id: id },
      { $set: { confirmationCode: newCode } },
    );
    return result.modifiedCount > 0;
  }

  async confirmRegistration(code: string) {
    const user = await this.registrationUserModel
      .findOne({ confirmationCode: code })
      .lean();
    if (!user) {
      throw {
        errorsMessages: [{ field: 'code', message: 'Code is invalid' }],
      };
    }

    if (user.isConfirmed) {
      throw {
        errorsMessages: [{ field: 'code', message: 'Code already used' }],
      };
    }

    if (user.expirationDate < new Date()) {
      throw {
        errorsMessages: [{ field: 'code', message: 'Code expired' }],
      };
    }

    const updateResult = await this.registrationUserModel.updateOne(
      { _id: user._id },
      { $set: { isConfirmed: true } },
    );

    const isCreated = await this.userRepositories.create({
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
      createdAt: new Date().toISOString(),
    });

    return updateResult.modifiedCount > 0 && isCreated;
  }

  async revokeRefreshToken(userId: string, token: string) {
    await this.revokedTokenModel.create({ userId, token });
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const revoked = await this.revokedTokenModel.findOne({ token }).lean();
    return !!revoked;
  }

  async createPasswordRecoveryRecord(
    userId: string,
    recoveryCode: string,
    expirationDate: Date,
  ) {
    await this.passwordRecoveryModel.create({
      userId,
      recoveryCode,
      expirationDate,
    });
  }

  async findPasswordRecoveryByCode(recoveryCode: string) {
    return this.passwordRecoveryModel.findOne({ recoveryCode }).exec();
  }

  async deletePasswordRecoveryRecordByCode(recoveryCode: string) {
    await this.passwordRecoveryModel.deleteOne({ recoveryCode });
  }

  async confirmNewPassword(newPassword: string, recoveryCode: string) {
    const record = await this.findPasswordRecoveryByCode(recoveryCode);
    if (!record || record.expirationDate < new Date()) {
      throw {
        errorsMessages: [
          {
            field: 'recoveryCode',
            message: 'Invalid or expired recovery code',
          },
        ],
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const isUpdated = await this.userRepositories.updatePasswordById(
      record.userId,
      hash,
      salt,
    );

    await this.deletePasswordRecoveryRecordByCode(recoveryCode);

    return isUpdated;
  }
}
