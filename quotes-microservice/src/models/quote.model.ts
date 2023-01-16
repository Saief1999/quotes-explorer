import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { Base } from "src/generics/db/base.model";


@Schema({ timestamps: true, versionKey: false })
export class Quote extends Base {
    _id: string;

    @IsNotEmpty()
    @Prop({ type: mongoose.Schema.Types.String })
    quote: string;

    @IsNotEmpty()
    @Prop({ type: mongoose.Schema.Types.String })
    author: string;

    @IsNotEmpty()
    @Prop({ type: mongoose.Schema.Types.String })
    tag: string
}


export const QuoteSchema = SchemaFactory.createForClass(Quote);