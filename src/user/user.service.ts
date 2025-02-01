import { Injectable } from '@nestjs/common';
// import { SetPreferencesDto, SetProfileDto } from './user.dto';
// import { DataBaseService } from 'src/database/database.service';
// import { CatchError } from 'decorators/CatchError.decorator';
// import languages from 'languages.json';
// import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class UserService {
  constructor() {} // private readonly cacheService: CacheService, // private readonly database: DataBaseService,
  // private getRandomNumber(min: number, max: number) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
  // private async generateUsername() {
  //   const chars =
  //     'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let username = '';
  //   for (let i = 0; i < 6; i++)
  //     username += chars[this.getRandomNumber(0, chars.length - 1)];
  //   return (await this.isVaildUsername(username)).vaild
  //     ? username
  //     : await this.generateUsername();
  // }

  // @CatchError()
  // async setPreferences({ phoneID, preferences }: SetPreferencesDto) {
  //   const users = await this.database.user.updateMany({
  //     where: { phoneIDs: { has: phoneID } },
  //     data: { preferenceIDs: preferences },
  //   });
  //   if (users.count == 0)
  //     await this.database.user.create({
  //       data: {
  //         phoneIDs: [phoneID],
  //         preferenceIDs: preferences,
  //         username: this.generateUsername(),
  //       },
  //     });
  //   return { messages: languages['set-preferences'] };
  // }

  // @CatchError()
  // async setProfile({
  //   id,
  //   name,
  //   username,
  //   bio,
  //   image,
  //   birthDate,
  //   notificationsToken,
  // }: Partial<SetProfileDto> & { id: string }) {
  //   const user = await this.database.user.update({
  //     where: { id },
  //     data: {
  //       name,
  //       bio,
  //       image,
  //       birthDate,
  //       username,
  //       notificationsTokens: { push: notificationsToken },
  //     },
  //   });
  //   this.cacheService.set(id, user, 60 * 60 * 24);
  //   return { messages: languages['set-profile'] };
  // }

  // @CatchError()
  // async isVaildUsername(username: string) {
  //   const count = await this.database.user.count({
  //     where: { username },
  //   });
  //   const vaild = count == 0;
  //   return {
  //     vaild,
  //     messages: languages[vaild ? 'vaild-username' : 'invaild-username'],
  //   };
  // }
}
