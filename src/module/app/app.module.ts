import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from '../teacher/teacher.module';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class/classroom.module';
import { LessonModule } from '../lesson/lesson.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    AuthModule,
    TeacherModule,
    ClassModule,
    LessonModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
