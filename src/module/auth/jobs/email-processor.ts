import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import type { Job } from "bull";
import { PinoLogger } from "nestjs-pino";
import { Resend } from "resend";

@Processor('email')
export class EmailProcessor {

    private resend = new Resend(process.env.RESEND_API_KEY)

    constructor(
        private readonly logger: PinoLogger
    ) {
        this.logger.info('EMAIL PROCESSOR CREATED');
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.info(`PROCESSING JobID: ${job.id}`)
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        this.logger.info(`EMAIL SENT - JobID: ${job.id}`)
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        this.logger.warn(`EMAIL FAILED - JobId: ${job.id} - Error: ${err.message}`)
    }

    @Process('send-verification-email')
    async handle(job: Job){
        const { email, verificationLink } = job.data

        this.logger.info(`SEND VERIFICATION EMAIL`)
        // console.log(JSON.stringify(job.data))

        await this.resend.emails.send({
            from: 'teamturmaly@resend.dev',
            to: email,
            subject: 'Hello World',
            html: `<strong>It works!</strong> get your link: ${verificationLink}`
        })
    }
}