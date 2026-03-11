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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppLoggerModule } from 'src/common/logger/logger.module';
import { GlobalExceptionFilter } from 'src/common/filters/global-exception.filter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ClassModule,
    LessonModule,
    PostModule,
    LlmModule,
    ScheduleModule.forRoot(),
    AppLoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000,
        limit: 30,
        blockDuration: 30000,
      }]
    })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter}
  ],
})
export class AppModule {}
