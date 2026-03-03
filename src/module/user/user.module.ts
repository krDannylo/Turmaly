import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { BcryptService } from "src/common/hash/bcrypt.service";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, BcryptService],
    exports: [UserService]
})
export class UserModule { }