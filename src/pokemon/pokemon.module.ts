import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { CommonModule } from 'src/common/common.module';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
    controllers: [PokemonController],
    providers: [PokemonService],
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            {
                name: Pokemon.name,
                schema: PokemonSchema,
            }
        ]),
        CommonModule,
    ],
    exports: [MongooseModule]
})

export class PokemonModule {}