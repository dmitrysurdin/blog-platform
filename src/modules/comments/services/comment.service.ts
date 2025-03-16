import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { mapCommentFromDb } from '../helpers/comment-mapper';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
    userLogin: string,
  ) {
    return this.commentRepository.create(
      postId,
      createCommentDto,
      userId,
      userLogin,
    );
  }

  async findById(commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return mapCommentFromDb(comment);
  }
}
