import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schemas/user.schema";

export interface Category {
    id: number;
    name: string;
    emoji: string;
    type: string;
}

@Schema({ timestamps: true })
export class Categories {
    @Prop({ 
        unique: true, required: true, 
        type: mongoose.Schema.Types.ObjectId, ref: User.name 
    })
    user: User;

    @Prop({ 
        required: true, 
        type: [{
            id: Number,
            name: String,
            emoji: String,
            type: String,
            _id: false
        }], 
        default: [] 
    })
    categories: Category[];
}

export const CategorySchema = SchemaFactory.createForClass(Categories);