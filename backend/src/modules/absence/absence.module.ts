import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';

@Module({
  imports: [DbModule],
  providers: [AbsenceService],
  controllers: [AbsenceController],
})
export class AbsenceModule {}
