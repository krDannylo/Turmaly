import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        PrismaModule,
        UserModule
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule { }