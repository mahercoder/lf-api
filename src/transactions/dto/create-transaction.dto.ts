import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/users/schemas/user.schema";

export class TransactionDto {
    
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    readonly type: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @IsNotEmpty()
    date: number;

    @IsString()
    description: string;

    @IsNotEmpty()
    createdAt: Date;

    @IsNotEmpty()
    updatedAt: Date;

    @IsEmpty({ message: "You cannot pass user id!"})
    readonly user: User;
}