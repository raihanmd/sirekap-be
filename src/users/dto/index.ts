import { ApiProperty } from "@nestjs/swagger";

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
