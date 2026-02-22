import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        PrismaModule,
        UserModule
    ],
    controllers: [LessonController],
    providers: [LessonService],
    exports: [LessonService]
})
export class LessonModule { }