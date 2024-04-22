import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ type: String, required: true })
  username!: string;

  @ApiProperty({ type: String, required: true })
  password!: string;

  token?: string;
}

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({ type: String, required: true })
  full_name!: string;

  @ApiProperty({ type: Number, required: true })
  province_id!: number;

  @ApiProperty({ type: Number, required: true })
  city_id!: number;

  @ApiProperty({ type: Number, required: true })
  date_of_birth!: number;
}

export class UpdateUserDto {
  @ApiProperty({ type: String, required: false })
  username?: string;

  @ApiProperty({ type: String, required: false })
  password?: string;

  @ApiProperty({ type: String, required: false })
  full_name?: string;

  @ApiProperty({ type: Number, required: false })
  province_id?: number;

  @ApiProperty({ type: Number, required: false })
  city_id?: number;

  @ApiProperty({ type: Number, required: false })
  date_of_birth?: number;
}
