import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseResponse<T> {
  @ApiProperty()
  payload!: T;

  @ApiProperty({ type: "number", example: 200 })
  statusCode!: number;
}
