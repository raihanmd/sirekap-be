import { ApiProperty } from "@nestjs/swagger";

export class PostVotingEventDto {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  type!: string;

  @ApiProperty({ type: Number })
  start_time!: number;

  @ApiProperty({ type: Number })
  end_time!: number;
}
