import {
  // Body,
  Controller,
  // Get,
  // Patch,
  // Query,
  // ValidationPipe,
} from '@nestjs/common';
// import { SetPreferencesDto, SetProfileDto } from './user.dto';
// import { UserService } from './user.service';
// import { UserDecorator } from 'decorators/user.decorator';
// import { Cache } from 'decorators/cache.decorator';

@Controller('user')
export class UserController {
  // constructor(private userService: UserService) {}
  // @Patch('preferences')
  // async setPreferences(@Body(new ValidationPipe()) body: SetPreferencesDto) {
  //   const { phoneID, preferences } = body;
  //   return await this.userService.setPreferences({ phoneID, preferences });
  // }
  // @Patch('profile')
  // async setProfile(
  //   @Body(new ValidationPipe()) body: Partial<SetProfileDto>,
  //   @UserDecorator({ idOnly: true }) userID: string,
  // ) {
  //   return await this.userService.setProfile({ ...body, id: userID });
  // }
  // @Cache(60 * 60 * 24 * 30)
  // @Get('vaildUsername')
  // async isVaildUsername(@Query('username') username: string) {
  //   return await this.userService.isVaildUsername(username);
  // }
}
