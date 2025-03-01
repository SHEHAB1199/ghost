import { IsUrl, MaxLength } from 'class-validator';

export type ReelsFilter = 'trend' | 'follower';

export class CreateReelDTO {
  @MaxLength(1024)
  content: string;
  @IsUrl()
  url: string;
}

export class CreateCommentReelDTO {
  @MaxLength(1024)
  content: string;
}
