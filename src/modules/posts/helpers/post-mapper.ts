import { Post } from '../schemas/post.schema';
import { PostResponseDto } from '../dto/post-response.dto';

export const mapPostFromDb = (post: Post): PostResponseDto => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  id: post._id.toString() as string,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
});

export const mapPostsFromDb = (posts: Post[]): PostResponseDto[] =>
  posts.map(mapPostFromDb);
