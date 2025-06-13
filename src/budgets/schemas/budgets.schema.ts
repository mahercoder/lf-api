import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schemas/user.schema";

export interface Budget {
    id: number;
    name: string;
    type: string;
    amount: number;
    categories: number[];  // Category.id larini saqlash uchun
    parent: number;       // Budget.id ni saqlash uchun
    percentage: number;
    limit: number;
}

@Schema({ timestamps: true })
export class Budgets {
    @Prop({ 
        unique: true, 
        required: true, 
        type: mongoose.Schema.Types.ObjectId, 
        ref: User.name 
    })
    user: User;

    @Prop({ 
        required: true, 
        type: [{
            id: Number,
            name: String,
            type: String,
            amount: Number,
            categories: [Number],
            parent: Number,
            percentage: Number,
            limit: Number,
            _id: false
        }], 
        default: [] 
    })
    budgets: Budget[];
}

export const BudgetSchema = SchemaFactory.createForClass(Budgets);
