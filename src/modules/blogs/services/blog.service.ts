import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { mapBlogFromDb, mapBlogsFromDb } from '../helpers/blog-mapper';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async create(createBlogDto: CreateBlogDto) {
    const blog = await this.blogRepository.create(createBlogDto);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return { ...createBlogDto, id: blog._id.toString() as string };
  }

  async findAll(query: {
    pageSize?: string;
    pageNumber?: string;
    searchNameTerm?: string;
    sortBy?: string;
    sortDirection?: string;
  }) {
    const pageSize = Number(query.pageSize) || 10;
    const pageNumber = Number(query.pageNumber) || 1;

    const { totalCount, items } = await this.blogRepository.findAll(
      pageSize,
      pageNumber,
      query.searchNameTerm || null,
      query.sortBy || 'createdAt',
      query.sortDirection === 'asc' ? 'asc' : 'desc',
    );

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mapBlogsFromDb(items),
    };
  }

  async findById(id: string) {
    const blogFromDb = await this.blogRepository.findById(id);

    if (!blogFromDb) {
      return null;
    }

    return mapBlogFromDb(blogFromDb);
  }

  async update(id: string, updateBlogDto: Partial<CreateBlogDto>) {
    return this.blogRepository.update(id, updateBlogDto);
  }

  async remove(id: string) {
    return this.blogRepository.remove(id);
  }
}
