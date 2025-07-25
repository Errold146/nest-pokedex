import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { handleMongoError } from 'src/common/utils/error-formatters';

@Injectable()
export class PokemonService {

    constructor(
        @InjectModel( Pokemon.name )
        private readonly pokemonModel: Model<Pokemon>
    ){}

    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLowerCase()
        try {
            const pokemon = await this.pokemonModel.create( createPokemonDto )
            return pokemon;
            
        } catch (error) {
            handleMongoError(error, 'No se pudo crear el Pokémon');
        }
    }

    async findAll(): Promise<{ id: string; no: number; name: string }[]> {
        const pokemons = await this.pokemonModel
            .find({}, { _id: 1, no: 1, name: 1 })
            .sort({ no: 1 })
            .lean();

        return pokemons.map(p => ({
            id: p._id.toString(),
            no: p.no,
            name: p.name,
        }));
    }

    async findOne(term: string): Promise<Pokemon> {
        let pokemon: Pokemon | null = null;

        switch (true) {
            case !isNaN(+term):
                // Verificación por el 'no'
                pokemon = await this.pokemonModel.findOne({ no: term });
                break;

            case isValidObjectId(term):
                // Verificación por el 'MongoId'
                pokemon = await this.pokemonModel.findById(term);
                break;

            default:
                // Verificación por el 'name'
                pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
                break;
        }

        if (!pokemon) {
            throw new NotFoundException(`El Pokémon '${term}' no existe.`);
        }

        return pokemon;
    }

    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        try {
            if (!updatePokemonDto || Object.keys(updatePokemonDto).length === 0) {
                throw new BadRequestException('Debe enviar al menos un campo para actualizar');
            }
    
            if (updatePokemonDto.name) {
                updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
            }
    
            let query = {};
    
            if (!isNaN(+term)) {
                query = { no: +term };
            } else if (isValidObjectId(term)) {
                query = { _id: term };
            } else {
                query = { name: term.toLowerCase().trim() };
            }
    
            const pokemon = await this.pokemonModel.findOneAndUpdate(
                query,
                updatePokemonDto,
                { new: true }
            );
    
            if (!pokemon) {
                throw new NotFoundException(`Pokemon con el término: "${term}" no fue encontrado`);
            }
    
            return pokemon;

        } catch (error) {
            handleMongoError(error, 'No se pudo actualizar el Pokémon');
        }
    }

    async remove(id: string) {
        try {
            const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
            if ( deletedCount === 0 ) {
                throw new BadRequestException(`El pokemon con el id: ${id} no existe en la base de datos.`);
            }
            return {
                message: 'Pokemon eliminado correctamente.'
            }

        } catch (error) {
            handleMongoError(error, `No se pudo eliminar el pokemon ${id}`)
        }
    }
}