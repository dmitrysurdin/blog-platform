import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: { login: string; email: string }): Promise<User> {
    return new this.userModel(createUserDto).save();
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
      .exec();

    const totalCount = await this.userModel.countDocuments(filter);

    return { items, totalCount };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
