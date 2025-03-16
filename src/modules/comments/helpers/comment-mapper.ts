import { Comment } from '../schemas/comment.schema';
import { CommentResponseDto } from '../dto/comment-response.dto';
import { LikeStatus } from '../../../constants';

export const mapCommentFromDb = (comment: Comment): CommentResponseDto => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  id: comment._id.toString() as string,
  content: comment.content,
  createdAt: comment.createdAt,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.dislikesCount,
    myStatus: LikeStatus.None,
  },
});

export const mapCommentsFromDb = (comments: Comment[]): CommentResponseDto[] =>
  comments.map(mapCommentFromDb);
