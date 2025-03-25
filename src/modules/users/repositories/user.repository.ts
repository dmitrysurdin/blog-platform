import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { User } from '../schemas/user.schema';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: {
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
  }): Promise<User> {
    return await this.userModel.create(user);
  }

  async findAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ): Promise<{ items: User[]; totalCount: number }> {
    const filter: Record<string, any> = {};

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];
      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
      }
      if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
      }
    }

    const skip = (pageNumber - 1) * pageSize;
    const items = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await this.userModel.countDocuments(filter);

    return { items, totalCount };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.userModel.findOne({ login }).lean();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean();
  }

  async updatePasswordById(
    userId: string,
    passwordHash: string,
    passwordSalt: string,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          passwordHash,
          passwordSalt,
        },
      },
    );

    return result.matchedCount > 0;
  }

  async isPasswordCorrect(user: User, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.passwordHash);
  }
}
