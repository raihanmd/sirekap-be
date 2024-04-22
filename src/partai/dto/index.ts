import { ApiProperty } from "@nestjs/swagger";

export class PostPartaiDto {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: "file", format: "binary", required: true })
  image!: Express.Multer.File;
}

export class DeletePartaiDto {
  @ApiProperty({ type: String })
  id!: string;
}

export class UpdatePartaiDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({
    type: "file",
    format: "binary",
    required: false,
  })
  image?: Express.Multer.File;
}
