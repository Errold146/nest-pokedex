import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { handleMongoError } from 'src/common/utils/error-formatters';
//? import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class PokemonService {
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,

        //? Listo para usar en caso que hacer una petición http a una api externa
        //? private readonly http: AxiosAdapter
        //? Ejemplo:
        //? const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    ){}

    // Crear Pokémon
    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLowerCase().trim();

        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return pokemon;
        } catch (error) {
            handleMongoError(error, 'No se pudo crear el Pokémon');
        }
    }

    // Obtener todos con paginación opcional
    async findAll(limit?: number, offset?: number): Promise<
        { id: string; no: number; name: string; imageUrl?: string; pokeUrl?: string }[]
    > {
        const query = this.pokemonModel
            .find({}, { _id: 1, no: 1, name: 1, imageUrl: 1, pokeUrl: 1 })
            .sort({ no: 1 })
            .lean();

        if (typeof offset === 'number' && !isNaN(offset)) query.skip(offset);
        if (typeof limit === 'number' && !isNaN(limit)) query.limit(limit);

        const pokemons = await query;

        return pokemons.map(p => ({
            id: p._id.toString(),
            no: p.no,
            name: p.name,
            imageUrl: p.imageUrl,
            pokeUrl: p.pokeUrl,
        }));
    }

    // Buscar por término (id, no, name)
    async findOne(term: string): Promise<Pokemon> {
        let pokemon: Pokemon | null = null;

        if (!isNaN(+term)) {
            pokemon = await this.pokemonModel.findOne({ no: +term }).lean();
        } else if (isValidObjectId(term)) {
            pokemon = await this.pokemonModel.findById(term).lean();
        } else {
            pokemon = await this.pokemonModel
                .findOne({ name: term.toLowerCase().trim() })
                .lean();
        }

        if (!pokemon) {
            throw new NotFoundException(`El Pokémon '${term}' no existe.`);
        }

        return pokemon;
    }

    // Actualizar por término
    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        try {
            if (!updatePokemonDto || Object.keys(updatePokemonDto).length === 0) {
                throw new BadRequestException(
                    'Debe enviar al menos un campo para actualizar',
                );
            }

            if (updatePokemonDto.name) {
                updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
            }

            const query = this.buildQuery(term);

            const pokemon = await this.pokemonModel.findOneAndUpdate(
                query,
                updatePokemonDto,
                { new: true },
            ).lean();

            if (!pokemon) {
                throw new NotFoundException(
                    `El Pokémon con el término "${term}" no fue encontrado.`,
                );
            }

            return pokemon;
        } catch (error) {
            handleMongoError(error, 'No se pudo actualizar el Pokémon');
        }
    }

    // Eliminar por ID
    async remove(id: string) {
        try {
            const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

            if (deletedCount === 0) {
                throw new BadRequestException(
                    `El Pokémon con el id: ${id} no existe en la base de datos.`,
                );
            }

            return {
                message: 'Pokémon eliminado correctamente.',
            };
        } catch (error) {
            handleMongoError(error, `No se pudo eliminar el Pokémon ${id}`);
        }
    }

    // Utilidad para construir query
    private buildQuery(term: string) {
        if (!isNaN(+term)) return { no: +term };
        if (isValidObjectId(term)) return { _id: term };
        return { name: term.toLowerCase().trim() };
    }
}