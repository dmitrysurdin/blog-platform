import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogRepository } from '../../blogs/repositories/blog.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { CreateCommentDto } from '../../comments/dto/create-comment.dto';
import { SortOrder } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const blog = await this.blogRepository.findById(createPostDto.blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.postRepository.create(createPostDto, blog.name);
  }

  async findAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchNameTerm: string | null,
  ) {
    return this.postRepository.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      searchNameTerm,
    );
  }

  async findById(postId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, updatedPost: Partial<CreatePostDto>) {
    return this.postRepository.update(id, updatedPost);
  }

  async remove(id: string) {
    return this.postRepository.remove(id);
  }

  async createCommentForPost(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
    userLogin: string,
  ) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.commentRepository.create(
      postId,
      createCommentDto,
      userId,
      userLogin,
    );
  }

  async getAllCommentsForPost(
    postId: string,
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null,
  ) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.commentRepository.findAllByPostId(
      postId,
      pageSize,
      pageNumber,
      sortBy,
      (sortDirection as SortOrder) || 'desc',
      searchNameTerm,
    );
  }

  async createPostForBlog(
    blogId: string,
    createPostDto: { title: string; shortDescription: string; content: string },
  ) {
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.postRepository.createForBlog(blogId, blog.name, createPostDto);
  }

  async getAllPostsByBlogId(
    blogId: string,
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: string,
  ) {
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.postRepository.findAllByBlogId(
      blogId,
      pageSize,
      pageNumber,
      sortBy,
      sortDirection as SortOrder,
    );
  }
}
