import { Module } from "@nestjs/common";
import { BullModule } from '@nestjs/bull';
import { bullConfig } from "./bull.config";

@Module({
    imports: [
        BullModule.forRoot({
            redis: bullConfig.redis,
            defaultJobOptions: {
                removeOnComplete: 100,
                removeOnFail: 100,
                attempts: 3,
            }
        })
    ],
    exports: [BullModule],
}) export class CustomBullModule {}