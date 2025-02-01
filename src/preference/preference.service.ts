import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CatchError } from 'decorators/CatchError.decorator';

@Injectable()
export class PreferenceService {
  constructor(private readonly database: DataBaseService) {}

  @CatchError()
  async findAll() {
    const preferences = this.database.preference.findMany({});
    return preferences;
  }
}
