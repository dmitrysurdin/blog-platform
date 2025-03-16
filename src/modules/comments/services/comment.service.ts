import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { mapCommentFromDb } from '../helpers/comment-mapper';
import { LikeStatus } from '../../../constants';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
    userLogin: string,
  ) {
    const defaultAdditionalInfo = {
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };
    const comment = await this.commentRepository.create(
      postId,
      { ...createCommentDto, ...defaultAdditionalInfo },
      userId,
      userLogin,
    );

    return {
      ...createCommentDto,
      ...defaultAdditionalInfo,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      id: comment._id.toString() as string,
    };
  }

  async findById(commentId: string) {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return mapCommentFromDb(comment);
  }
}
