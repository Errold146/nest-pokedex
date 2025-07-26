import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
    controllers: [PokemonController],
    providers: [PokemonService],
    imports: [
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