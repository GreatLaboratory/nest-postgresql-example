import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    readonly name: string;
    @IsNumber()
    readonly age: number;
    @IsString()
    readonly email: string;
    @IsString()
    readonly password: string;
    @IsString()
    readonly country: string
    @IsString()
    readonly city: string
    @IsString()
    readonly street: string
    @IsString()
    readonly zipCode: string
} 
