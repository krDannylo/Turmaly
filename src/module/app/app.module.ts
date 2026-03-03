import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class/classroom.module';
import { LessonModule } from '../lesson/lesson.module';
import { PostModule } from '../post/post.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ClassModule,
    LessonModule,
    PostModule,
    LlmModule
    // ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
