import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbModule } from '../../db/db.module';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [DbModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
