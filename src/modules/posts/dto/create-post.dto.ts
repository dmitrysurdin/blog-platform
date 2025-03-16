import { IsArray, IsString, Length, ValidateNested } from 'class-validator';
import { LikeStatus } from '../../../constants';

class NewestLikeDto {
  @IsString()
  addedAt: string;

  @IsString()
  userId: string;

  @IsString()
  login: string;
}

class ExtendedLikesInfoDto {
  likesCount: number = 0;

  dislikesCount: number = 0;

  myStatus: LikeStatus = LikeStatus.None;

  @IsArray()
  @ValidateNested({ each: true })
  newestLikes: NewestLikeDto[] = [];
}

export class CreatePostDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  content: string;

  @IsString()
  blogId: string;

  @ValidateNested()
  extendedLikesInfo?: ExtendedLikesInfoDto;
}
