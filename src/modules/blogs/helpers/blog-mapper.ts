import { Blog } from '../schemas/blog.schema';
import { BlogResponseDto } from '../dto/blog-response.dto';

export const mapBlogFromDb = (blog: Blog): BlogResponseDto => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  id: blog.id.toString() as string,
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  isMembership: blog.isMembership,
  createdAt: blog.createdAt,
});

export const mapBlogsFromDb = (blogs: Blog[]): BlogResponseDto[] =>
  blogs.map(mapBlogFromDb);
