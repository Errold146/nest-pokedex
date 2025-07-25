import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity'; 
import { PokeResponse } from './interfaces/poke-res.interface';

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>
    ) { }

    async executeSeed() {
        await this.pokemonModel.deleteMany({}); // Limpia la colección

        const { data } = await axios.get<PokeResponse>(
            'https://pokeapi.co/api/v2/pokemon?limit=650'
        );

        const pokemonToInsert = data.results.map(({ name, url }) => {
            const segments = url.split('/');
            const no: number = +segments[segments.length - 2];
            const imageUrl = 
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${no}.png`;

            return {
                name,
                no,
                pokeUrl: url,
                imageUrl
            };
        });

        await this.pokemonModel.insertMany(pokemonToInsert); // Inserta todos

        return { message: 'Seed ejecutado correctamente', count: pokemonToInsert.length }
    }
}