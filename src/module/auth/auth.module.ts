import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { HashingServiceProtocol } from "../../common/hash/hashing.service";
import { BcryptService } from "../../common/hash/bcrypt.service";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { BullModule } from "@nestjs/bull";
import { EmailQueue } from "./jobs/email-queue";
import { EmailProcessor } from "./jobs/email-processor";

@Global()
@Module({
    imports: [
        BullModule.registerQueue({
            name: 'email'
        }),
        PrismaModule,
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider())
    ],
    providers: [{ 
        provide: HashingServiceProtocol, 
        useClass: BcryptService
    }, 
        AuthService,
        EmailQueue,
        EmailProcessor
    ],
    exports: [
        HashingServiceProtocol,
        JwtModule,
        ConfigModule
    ],
    controllers: [AuthController],
})
export class AuthModule { }