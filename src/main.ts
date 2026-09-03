import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
    .setTitle('Virtual AI Manager API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Virtual AI Manager API',
    customCss: `
      .swagger-ui .topbar {
        background-color: #1f2937;
      }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();