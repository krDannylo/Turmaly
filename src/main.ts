import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())

  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
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
    // new SanitizePipe()
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
