import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function main() {
    const app = await NestFactory.create(AppModule);

    // Accede al ConfigService después de crear la app
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port') ?? 3000;

    app.setGlobalPrefix('api/v2');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    await app.listen(port);
    // console.log(`Servidor corriendo en http://localhost:${port}`);
}

main();