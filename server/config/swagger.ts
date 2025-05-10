import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Swagger API')
    .setDescription('The Swagger API description')
    .setVersion('1.0')
    .addTag('Swagger')
    .build();

  const path = 'docs';

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, documentFactory);

  return { path };
};
