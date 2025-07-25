import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Pokemon extends Document {

    @Prop({
        unique: true,
        index: true
    })
    name: string

    @Prop({
        unique: true,
        index: true
    })
    no: number

    @Prop({ required: false })
    pokeUrl?: string

    @Prop({ required: false })
    imageUrl?: string;

}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon )