import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { PayType } from "src/utils/types";

export interface Goal {
    id: number;
    lender_name: string;
    amount: number;
    repayDate: number;
    payType: string;
    categoryId: number;
    description: string;
    payouts: number[];  // Transaction.id larini saqlash uchun
}

@Schema({ timestamps: true })
export class Goals {
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
            categoryId: Number,
            description: String,
            payouts: [Number],
            _id: false
        }], 
        default: [] 
    })
    goals: Goal[];
}

export const GoalSchema = SchemaFactory.createForClass(Goals);
