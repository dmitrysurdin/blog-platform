import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../../comments/dto/create-comment.dto';
import { DATABASE } from '../../../constants';
import { Response } from 'express';

@Controller(DATABASE.POSTS_COLLECTION)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  async getAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    return this.postService.findAll(
      Number(pageSize) || 10,
      Number(pageNumber) || 1,
      sortBy || 'createdAt',
      sortDirection === 'asc' ? 'asc' : 'desc',
      searchNameTerm || null,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const post = await this.postService.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedPost: Partial<CreatePostDto>,
    @Res() res: Response,
  ) {
    const isUpdated = await this.postService.update(id, updatedPost);

    if (!isUpdated) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const isDeleted = await this.postService.remove(id);

    if (!isDeleted) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    const post = await this.postService.findById(postId);

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.postService.createCommentForPost(
      postId,
      createCommentDto,
      req?.user?.id ?? 'unknown',
      req?.user?.login ?? 'unknown',
    );
  }

  @Get(':postId/comments')
  async getAllCommentsForPost(
    @Param('postId') postId: string,
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    return this.postService.getAllCommentsForPost(
      postId,
      Number(pageSize) || 10,
      Number(pageNumber) || 1,
      sortBy || 'createdAt',
      sortDirection === 'asc' ? 'asc' : 'desc',
      searchNameTerm || null,
    );
  }
}
