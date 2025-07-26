import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}

    @Post()
    create(@Body() createPokemonDto: CreatePokemonDto) {
        return this.pokemonService.create(createPokemonDto);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        const { page = 0, limit = 10 } = paginationDto;
        const offset = page * limit;
        return this.pokemonService.findAll(limit, offset);
    }

    @Get(':term')
    findOne(@Param('term') term: string) {
        return this.pokemonService.findOne(term);
    }

    @Patch(':term')
    update(
        @Param('term') term: string,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updatePokemonDto: UpdatePokemonDto
    ) {
        return this.pokemonService.update(term, updatePokemonDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseMongoIdPipe) id: string) {
        return this.pokemonService.remove(id);
    }
}
