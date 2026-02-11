import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ClassroomController } from "./classroom.controller";
import { ClassroomService } from "./classroom.service";
import { BullModule } from "@nestjs/bull"
import { CleanupAccesCodeProcessor } from "./jobs/cleanup-access-code.processor";
import { CleanupAccessCodeScheduler } from "./jobs/cleanup-access-code.scheduler";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'access-code'
        }),
        PrismaModule
    ],
    controllers: [ClassroomController],
    providers: [
        ClassroomService,
        CleanupAccesCodeProcessor,
        CleanupAccessCodeScheduler
    ]
})
export class ClassModule { }