import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
 
  // app.setGlobalPrefix('api');
app.use(cookieParser());

app.enableCors({
  origin: [ 'https://gymsuperarse.web.app',
          'https://gymsuperarse.firebaseapp.com',  /// direccion que te provee la pagina render
            'http://localhost:5173'],
           methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          credentials: true,
          allowedHeaders: ['Content-Type', 'Authorization'],
 });

  // Validamos y transformamos los DTO para que respeten los tipos declarados
  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
      // whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();