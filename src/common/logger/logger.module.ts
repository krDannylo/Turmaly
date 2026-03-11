import { LoggerModule } from 'nestjs-pino';

export const AppLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',

    redact: ['req.headers.authorization', 'req.headers.cookie'],

    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        ignore: 'req,res',
        translateTime: 'HH:MM:ss',
        messageFormat: '{msg}',
      },
    },

    customSuccessMessage: (req, res) =>
      `Method: ${req.method}, Path: ${req.url}, Status: ${res.statusCode}`,

    customErrorMessage: (req, res) =>
      `Method: ${req.method}, Path: ${req.url}, Status: ${res.statusCode}`,

    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    customErrorObject: (req, res, err) => ({
      method: req.method,
      path: req.url,
      statusCode: res.statusCode,
    }),

    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  },
});