import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/users/schemas/user.schema";

export class CategoryDto {
    
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly name: string;
    
    @IsNotEmpty()
    @IsString()
    readonly emoji: string;
    
    @IsNotEmpty()
    @IsString()
    readonly type: string;

    @IsEmpty({ message: "You cannot pass user id!"})
    readonly user: User;
}