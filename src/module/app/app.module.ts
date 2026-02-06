import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from '../teacher/teacher.module';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class/classroom.module';

@Module({
  imports: [
    AuthModule,
    TeacherModule,
    ClassModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
