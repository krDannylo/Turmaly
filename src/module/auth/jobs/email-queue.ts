import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import type { Queue } from "bull";
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class EmailQueue {
    constructor(
        @InjectQueue('email')
        private readonly emailQueue: Queue,
        private readonly jwtService: JwtService,
        private readonly logger: PinoLogger
    ) { }

    async sendVerificationEmail(user: User){
        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
                type: 'email-verification'
            },
            { expiresIn: '1h' }
        )

        const verificationLink =
            process.env.LOCAL_URL + `/verify-email?token=${token}`

        await this.emailQueue.add(
            'send-verification-email',
            {
                email: user.email,
                verificationLink
            },
            {
                removeOnComplete: true,
                // attempts: 3,
            }
        )
    }
}