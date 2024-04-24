import { ApiProperty } from "@nestjs/swagger";
import { CandidatesType } from "@prisma/client";

export class PostVotingEventDto {
  @ApiProperty({ type: String })
  type!: CandidatesType;

  @ApiProperty({ type: Number })
  start_time!: number;

  @ApiProperty({ type: Number })
  end_time!: number;
}
