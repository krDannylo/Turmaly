import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import type { Queue } from "bull";

@Injectable()
export class CleanupAccessCodeScheduler {
    constructor(
        @InjectQueue('access-code') //Injeta a fila 'access-code' registrada no módulo Classroom
        private readonly accessCodeQueue: Queue,
    ) { }

    @Cron('*/30 * * * *', {
        timeZone: 'America/Sao_Paulo'
    })
    async handleCron() {
        await this.accessCodeQueue.add(
            'cleanup-access-code', //Nome do Job que estou adicionando a fila
            {},
            {
                removeOnComplete: true,
                // attempts: 3,
                jobId: 'cleanup-access-code-singleton'
            }
        )
    }
}