import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ClassroomController } from "./classroom.controller";
import { ClassroomService } from "./classroom.service";
import { BullModule } from "@nestjs/bull"
import { CleanupAccesCodeProcessor } from "./jobs/cleanup-access-code.processor";
import { CleanupAccessCodeScheduler } from "./jobs/cleanup-access-code.scheduler";
import { UserModule } from "../user/user.module";
import { LessonModule } from "../lesson/lesson.module";
import { PostModule } from "../post/post.module";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'access-code'
        }),
        PrismaModule,
        UserModule,
        LessonModule,
        PostModule
    ],
    controllers: [ClassroomController],
    providers: [
        ClassroomService,
        CleanupAccesCodeProcessor,
        CleanupAccessCodeScheduler
    ]
})
export class ClassModule { }