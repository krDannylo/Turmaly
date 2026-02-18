import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from '../teacher/teacher.module';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class/classroom.module';
import { LessonModule } from '../lesson/lesson.module';
import { PostModule } from '../post/post.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthModule,
    // TeacherModule,
    // UserModule,
    // ClassModule,
    // LessonModule,
    // PostModule,
    // ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
