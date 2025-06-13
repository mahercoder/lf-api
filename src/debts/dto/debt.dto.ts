import { IsArray, IsDate, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/users/schemas/user.schema";

export class DebtDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly lender_name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;

    @IsNotEmpty()
    readonly repayDate: number;

    @IsNotEmpty()
    readonly payType: string;

    @IsNotEmpty()
    readonly lenderType: string;

    @IsNotEmpty()
    @IsNumber()
    readonly categoryId: number;

    @IsString()
    readonly description: string;

    @IsArray()
    @IsNumber({}, { each: true })
    readonly payouts: number[];

    @IsEmpty({ message: "You cannot pass user id!"})
    readonly user: User;
}
