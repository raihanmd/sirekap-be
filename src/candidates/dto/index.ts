import { ApiProperty } from "@nestjs/swagger";
import { CandidatesType } from "@prisma/client";
export class PostCandidatesDto {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  party_id!: string;

  @ApiProperty({ type: Number })
  province_id!: number;

  @ApiProperty({ type: Number })
  city_id!: number;

  @ApiProperty({ type: String, example: "PRESIDEN" })
  type!: CandidatesType;

  @ApiProperty({
    type: "file",
    format: "binary",
  })
  image!: Express.Multer.File;
}

export class PatchCandidatesDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({ type: String, required: false })
  party_id?: string;

  @ApiProperty({ type: Number, required: false })
  province_id?: number;

  @ApiProperty({ type: Number, required: false })
  city_id?: number;

  @ApiProperty({ type: String, example: "PRESIDEN", required: false })
  type?: CandidatesType;

  @ApiProperty({
    type: "file",
    format: "binary",
    required: false,
  })
  image?: Express.Multer.File;
}

export class DeleteCandidatesDto {
  @ApiProperty({ type: String })
  id!: string;
}
export type QueryCandidatesParam = {
  type: CandidatesType;

  page: number;

  size: number;
};
