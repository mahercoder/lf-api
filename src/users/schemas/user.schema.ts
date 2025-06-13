import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User extends Document {
    
    @Prop({ 
        unique: [ true, 'Email must be unique!'], 
        required: true 
    })
    email: string;
    
    @Prop({ required: true })
    password: string;
    
    @Prop()
    firstname: string;
    
    @Prop()
    lastname: string;
    
    @Prop()
    phone_number: string;
    
    @Prop()
    job_type: string
    
    @Prop()
    job_position: string
    
    @Prop()
    job_salary: string

    @Prop({ default: false })
    is_premium: boolean;

    @Prop()
    currency: string;

    @Prop()
    language: string;
}

export const UserSchema = SchemaFactory.createForClass(User);