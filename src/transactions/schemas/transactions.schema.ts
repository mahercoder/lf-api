import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";

// Schema o'rniga interface yoki type ishlatamiz
export interface Transaction {
    id: number;
    type: string;
    amount: number;
    categoryId: number;
    date: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

@Schema({ timestamps: true })
export class Transactions {
    @Prop({ 
        required: true, 
        type: mongoose.Schema.Types.ObjectId, ref: User.name 
    })
    user: User;

    @Prop({ required: true })
    year: number;

    @Prop({ required: true })
    month: number;

    @Prop({ 
        required: true, 
        type: [{ 
            id: Number,
            type: String,
            amount: Number,
            categoryId: Number,
            date: Number,
            description: String,
            createdAt: Date,
            updatedAt: Date,
            _id: false
        }], 
        default: [] 
    })
    transactions: Transaction[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transactions);