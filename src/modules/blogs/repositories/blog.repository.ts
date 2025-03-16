import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../schemas/blog.schema';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    return new this.blogModel(createBlogDto).save();
  }

  async findAll(
    pageSize: number,
    pageNumber: number,
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<{ items: Blog[]; totalCount: number }> {
    const filter = searchNameTerm
      ? { name: new RegExp(searchNameTerm, 'i') }
      : {};
    const skip = (pageNumber - 1) * pageSize;
    const items = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCount = await this.blogModel.countDocuments(filter);
    return { items, totalCount };
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogModel.findById(id).exec();
  }

  async update(
    id: string,
    updateBlogDto: Partial<CreateBlogDto>,
  ): Promise<boolean> {
    const result = await this.blogModel
      .updateOne({ _id: id }, { $set: updateBlogDto })
      .exec();
    return result.modifiedCount > 0;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
