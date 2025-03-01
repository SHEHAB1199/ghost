import { Module } from '@nestjs/common';
import { PoliceService } from './police.service';
import { PoliceController } from './police.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [PoliceController],
  providers: [PoliceService, DataBaseService],
})
export class PoliceModule {}