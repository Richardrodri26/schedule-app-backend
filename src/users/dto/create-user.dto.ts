import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

  @IsString()
  public username: string;

  @IsString()
  @MinLength(10)
  public password: string;

  @IsString()
  public name: string;

  @IsOptional()
  @IsEmail()
  public email?: string;

}
