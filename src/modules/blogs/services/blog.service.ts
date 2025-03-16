import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async create(createBlogDto: CreateBlogDto) {
    return this.blogRepository.create(createBlogDto);
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
    return this.blogRepository.findAll(
      pageSize,
      pageNumber,
      query.searchNameTerm || null,
      query.sortBy || 'createdAt',
      query.sortDirection === 'asc' ? 'asc' : 'desc',
    );
  }

  async findById(id: string) {
    return this.blogRepository.findById(id);
  }

  async update(id: string, updateBlogDto: Partial<CreateBlogDto>) {
    return this.blogRepository.update(id, updateBlogDto);
  }

  async remove(id: string) {
    return this.blogRepository.remove(id);
  }
}
