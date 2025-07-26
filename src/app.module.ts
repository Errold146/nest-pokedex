import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfig } from './config/env.config';

@Module({
    imports: [
        ConfigModule.forRoot({ 
            isGlobal: true,
            load: [EnvConfig],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('mongodb');
                if (!uri) {
                    throw new Error('La variable de entorno MONGODB no está definida');
                }
                return { uri };
            },
        }),
        PokemonModule,
        CommonModule,
        SeedModule,
    ],
})
export class AppModule {}