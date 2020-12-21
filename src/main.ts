import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap () {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle('NestJS PostgreSQL example')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    app.use(morgan('tiny'));
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true, // 필요없는 변수는 필요없다라고 응답으로 주는거
        transform: true, // 컨트롤러에서 받는 리퀘스트 관련 데코레이터 변수를 자기가 지정타입으로 자동 변환시켜주는 애
    }));
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
