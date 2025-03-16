import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { DATABASE } from '../../../constants';
import { CreateCommentDto } from '../dto/create-comment.dto';

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
  async findById(@Param('id') id: string) {
    return this.commentService.findById(id);
  }
}
