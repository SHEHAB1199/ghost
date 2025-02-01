import { Controller, Get } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { Cache } from 'decorators/cache.decorator';

@Controller('preferences')
export class PreferenceController {
  constructor(private preferenceService: PreferenceService) {}

  @Get()
  @Cache(60 * 60 * 24 * 30)
  findAll() {
    return this.preferenceService.findAll();
  }
}
