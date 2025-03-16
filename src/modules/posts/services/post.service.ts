import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogRepository } from '../../blogs/repositories/blog.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { CreateCommentDto } from '../../comments/dto/create-comment.dto';
import { SortOrder } from 'mongoose';
import { mapPostFromDb, mapPostsFromDb } from '../helpers/post-mapper';
import { mapCommentsFromDb } from '../../comments/helpers/comment-mapper';

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
    const post = await this.postRepository.create(createPostDto, blog.name);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return { ...createPostDto, id: post._id.toString() as string };
  }

  async findAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchNameTerm: string | null,
  ) {
    const { items, totalCount } = await this.postRepository.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      searchNameTerm,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mapPostsFromDb(items),
    };
  }

  async findById(postId: string) {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return mapPostFromDb(post);
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

    const comment = await this.commentRepository.create(
      postId,
      createCommentDto,
      userId,
      userLogin,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return { ...createCommentDto, id: comment._id.toString() as string };
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

    const { items, totalCount } = await this.commentRepository.findAllByPostId(
      postId,
      pageSize,
      pageNumber,
      sortBy,
      (sortDirection as SortOrder) || 'desc',
      searchNameTerm,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mapCommentsFromDb(items),
    };
  }

  async createPostForBlog(
    blogId: string,
    createPostDto: { title: string; shortDescription: string; content: string },
  ) {
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const post = await this.postRepository.createForBlog(
      blogId,
      blog.name,
      createPostDto,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return { ...createPostDto, id: post._id.toString() as string };
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

    const { items, totalCount } = await this.postRepository.findAllByBlogId(
      blogId,
      pageSize,
      pageNumber,
      sortBy,
      sortDirection as SortOrder,
    );

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mapPostsFromDb(items),
    };
  }
}
