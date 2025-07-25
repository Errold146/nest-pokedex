import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
    
    @IsInt()
    @IsPositive({message: 'El no debe ser un entero positivo.'})
    @Min(1, {message: 'El no puede ser menor que 1'})
    no: number;

    @IsString()
    @MinLength(3, {message: 'El nombre es demasiado corto'})
    name: string
}