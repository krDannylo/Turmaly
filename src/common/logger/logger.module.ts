import { LoggerModule } from 'nestjs-pino';

export const AppLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'prod'
        ? { target: 'pino-pretty' }
        : undefined,
  },
});