import { IsArray, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/users/schemas/user.schema";

export class BudgetDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    readonly type: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;

    @IsArray()
    @IsNumber({}, { each: true })
    readonly categories: number[];

    @IsNumber()
    readonly parent: number;

    @IsNumber()
    readonly percentage: number;

    @IsNumber()
    readonly limit: number;

    @IsEmpty({ message: "You cannot pass user id!"})
    readonly user: User;
}
