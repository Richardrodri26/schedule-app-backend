import { IsString, MinLength } from "class-validator";

export class CreateUserDto {

  @IsString()
  public username: string;

  @IsString()
  @MinLength(10)
  public password: string;

}
