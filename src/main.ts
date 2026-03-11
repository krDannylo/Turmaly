import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SanitizePipe } from './common/pipes/sanitize.pipe';
import helmet from 'helmet';
import * as Joi from 'joi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())

  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: Joi.object({
      RESEND_API_KEY: Joi.string().required(),
      DATABASE_URL: Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      OPENAI_API_KEY: Joi.string().required(),
    })
  })

  app.enableCors({
    origin: '*',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    new SanitizePipe()
  )

  const config = new DocumentBuilder()
    .setTitle('Turmaly API')
    .setDescription('')
    .setVersion('1.0')
    // .addBearerAuth()
    .build()

    const documentFactory = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
