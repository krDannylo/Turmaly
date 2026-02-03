import { Module } from "@nestjs/common";
import { TeacherController } from "./teacher.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { TeacherService } from "./teacher.service";
import { HashingServiceProtocol } from "../../common/hash/hashing.service";
import { BcryptService } from "../../common/hash/bcrypt.service";

@Module({
    imports: [PrismaModule],
    controllers: [TeacherController],
    providers: [
        TeacherService,
        { provide: HashingServiceProtocol, useClass: BcryptService },
    ],
})
export class TeacherModule { }