import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { DbModule } from "./db/db.module";
import { UsersModule } from "./modules/users/users.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { AbsenceModule } from "./modules/absence/absence.module";

@Module({
  imports: [
    AuthModule, 
    DbModule, 
    UsersModule, 
    ProfileModule, 
    FeedbackModule,
    AbsenceModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
