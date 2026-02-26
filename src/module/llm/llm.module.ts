import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { LlmController } from "./llm.controller";
import { LlmService } from "./services/llm.service";
import { PostModule } from "../post/post.module";
import { ChatService } from "./services/chat.service";

@Module({
    imports: [
        PrismaModule,
        PostModule,
    ],
    controllers: [LlmController],
    providers: [
        LlmService,
        ChatService
    ],
})
export class LlmModule {}