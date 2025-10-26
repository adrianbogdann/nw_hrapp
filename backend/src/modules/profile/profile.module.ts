import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [DbModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
