import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto, blogName: string): Promise<Post> {
    return new this.postModel({
      ...createPostDto,
      blogName,
      createdAt: new Date().toISOString(),
    }).save();
  }

  async findById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async findAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchNameTerm: string | null,
  ): Promise<{ items: Post[]; totalCount: number }> {
    const filter = searchNameTerm
      ? { title: new RegExp(searchNameTerm, 'i') }
      : {};
    const skip = (pageNumber - 1) * pageSize;

    const items = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCount = await this.postModel.countDocuments(filter);

    return { items, totalCount };
  }

  async update(id: string, updatedPost: Partial<Post>): Promise<boolean> {
    const result = await this.postModel.updateOne(
      { _id: id },
      { $set: updatedPost },
    );
    return result.modifiedCount > 0;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async createForBlog(
    blogId: string,
    blogName: string,
    createPostDto: { title: string; shortDescription: string; content: string },
  ): Promise<Post> {
    return new this.postModel({
      ...createPostDto,
      blogId,
      blogName,
    }).save();
  }

  async findAllByBlogId(
    blogId: string,
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
  ): Promise<{ items: Post[]; totalCount: number }> {
    const skip = (pageNumber - 1) * pageSize;

    const items = await this.postModel
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCount = await this.postModel.countDocuments({ blogId });

    return { items, totalCount };
  }
}
