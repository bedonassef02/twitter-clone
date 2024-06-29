import { DocumentBuilder } from '@nestjs/swagger';

export const options = new DocumentBuilder()
  .setTitle('Twitter APP API')
  .setDescription('The Twitter API description')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://twitter-api-ld6h.onrender.com/', 'Production')
  .addBearerAuth()
  .build();
