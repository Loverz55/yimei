import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppConfigService } from './config/config.service';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取配置服务
  const appConfig = app.get(AppConfigService);

  // 启用 CORS
  app.enableCors();

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('医美管理系统')
    .setDescription('医美管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(document));

  const port = appConfig.port;
  await app.listen(port);
  console.log(`应用运行在端口: ${port}`);
  console.log(`当前环境: ${appConfig.nodeEnv}`);
  console.log(`API 文档: http://localhost:${port}/api`);
}
bootstrap();
