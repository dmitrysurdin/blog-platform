import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { PostService } from '../../posts/services/post.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { DATABASE } from '../../../constants';

@Controller(DATABASE.BLOG_COLLECTION)
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly postService: PostService,
  ) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  async findAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    return this.blogService.findAll({
      pageSize,
      pageNumber,
      searchNameTerm,
      sortBy,
      sortDirection,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: Partial<CreateBlogDto>,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body()
    createPostDto: { title: string; shortDescription: string; content: string },
  ) {
    return this.postService.createPostForBlog(blogId, createPostDto);
  }

  @Get(':blogId/posts')
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    return this.postService.getAllPostsByBlogId(
      blogId,
      Number(pageSize) || 10,
      Number(pageNumber) || 1,
      sortBy || 'createdAt',
      sortDirection === 'asc' ? 'asc' : 'desc',
    );
  }
}
