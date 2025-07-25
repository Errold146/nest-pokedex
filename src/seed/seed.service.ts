import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import type { PokeResponse } from './interfaces/poke-res.interface';

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios

    async excuteSeed() {
        const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
        return data.results
    }
}
