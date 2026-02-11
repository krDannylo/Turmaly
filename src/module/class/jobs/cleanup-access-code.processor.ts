import { Process, Processor } from "@nestjs/bull";
import { ClassroomService } from "../classroom.service";
import type { Job } from "bull";
import now from "src/common/utils/date-now-with-hour.util";

@Processor('access-code')
export class CleanupAccesCodeProcessor {
    constructor(
        private readonly classroomService: ClassroomService
    ){ }

    @Process('cleanup-access-code')
    async handle(job: Job){
        console.log(`[${now}] INFO: Cron Job 'cleanup-access-code' started`)

        // const data = await this.classroomService.deleteInvalidCode()
        
        // console.log(`Deleted: ${JSON.stringify(data)}`)
    }
}