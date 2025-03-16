import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { DATABASE } from '../../../constants';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Response } from 'express';

@Controller(DATABASE.COMMENTS_COLLECTION)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentService.createComment(
      postId,
      createCommentDto,
      req?.user?.id || 'unkown',
      req?.user?.login || 'unkown',
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const comment = await this.commentService.findById(id);

    if (!comment) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return comment;
  }
}
