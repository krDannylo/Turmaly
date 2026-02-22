import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        PrismaModule,
        UserModule,
    ],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService]
}) export class StudentModule { }