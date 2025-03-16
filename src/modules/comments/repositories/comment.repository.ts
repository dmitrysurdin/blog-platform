import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
    userLogin: string,
  ): Promise<Comment> {
    return new this.commentModel({
      postId,
      content: createCommentDto.content,
      commentatorInfo: { userId, userLogin },
      createdAt: new Date().toISOString(),
      likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None' },
    }).save();
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }

  async findAllByPostId(
    postId: string,
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchNameTerm: string | null,
  ): Promise<{ items: Comment[]; totalCount: number }> {
    const filter: any = { postId };
    if (searchNameTerm) {
      filter.content = { $regex: searchNameTerm, $options: 'i' };
    }

    const skip = (pageNumber - 1) * pageSize;
    const items = await this.commentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCount = await this.commentModel.countDocuments(filter);

    return { items, totalCount };
  }
}
