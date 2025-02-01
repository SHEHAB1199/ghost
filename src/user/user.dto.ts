import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
} from 'class-validator';

export class SetPreferencesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(3)
  @IsString({ each: true })
  readonly preferences: string[];

  @IsString()
  readonly phoneID: string;
}

export class SetProfileDto {
  name: string;
  username: string;
  bio: string;
  image: string;
  birthDate: Date;
  notificationsToken: string;
}
