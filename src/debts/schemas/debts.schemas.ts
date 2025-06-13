import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";

export interface Debt {
    id: number;
    lender_name: string;
    amount: number;
    repayDate: number;
    payType: string;
    lenderType: string;
    categoryId: number;
    description: string;
    payouts: number[];  // Transaction.id larini saqlash uchun
}

@Schema({ timestamps: true })
export class Debts {
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
            lender_name: String,
            amount: Number,
            repayDate: Number,
            payType: String,
            lenderType: String,
            categoryId: Number,
            description: String,
            payouts: [Number],
            _id: false
        }], 
        default: [] 
    })
    debts: Debt[];
}

export const DebtSchema = SchemaFactory.createForClass(Debts);
