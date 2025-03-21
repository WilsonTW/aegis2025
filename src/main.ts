import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all_exceptions.filter';
import { DarkBox } from './util/darkbox';
import { RecordConverter } from './util/record_converter';
import { AppConfigService } from './app_config.service';
import { writeFileSync } from 'fs';
// import { GraphInspector } from '@nestjs/core/inspector';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 嘗試啟用 GraphInspector（確保不報錯）
  // try {
  //   const inspector = app.get('GraphInspector', { strict: false });
  //   if (inspector && typeof inspector.listen === 'function') {
  //     inspector.listen(); // 這行確保 /graph 路由可用
  //     console.log('✅ GraphInspector 啟動成功，請訪問 /graph');
  //   } else {
  //     console.warn('⚠️ 無法啟動 GraphInspector，請檢查 @nestjs/core 版本');
  //   }
  // } catch (error) {
  //   console.warn('⚠️ GraphInspector 無法啟動，錯誤資訊:', error.message);
  // }

  const config = new DocumentBuilder()
    .setTitle('AEGIS')
    .setDescription('The aegis API description')
    .setVersion('1.0')
    .addTag('apis')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  /*
  // 對 paths 進行排序
  const sortedPaths = Object.keys(document.paths)
    .sort()
    .reduce((acc, key) => {
      acc[key] = document.paths[key];
      return acc;
    }, {});
  document.paths = sortedPaths;
  */
  
  //const { httpAdapter } = app.get(HttpAdapterHost);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  var test_mode = AppConfigService.getSystemConfig().test_mode
  console.log('............................. test_mode='+test_mode + ' .............................')
  console.log('............................. test_mode='+test_mode + ' .............................')
  console.log('............................. test_mode='+test_mode + ' .............................')
  console.log('............................. test_mode='+test_mode + ' .............................')
  console.log('............................. test_mode='+test_mode + ' .............................')
  if (test_mode) {
    await app.listen(3001);
  } else {
    await app.listen(3000);
  }
}
bootstrap();
