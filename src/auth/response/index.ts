import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../common/response/base-response";

class UserPayload {
  @ApiProperty({ type: "string" })
  token!: string;
}

export class RegisterResponse extends BaseResponse<UserPayload> {
  @ApiProperty({ type: UserPayload })
  payload!: UserPayload;
}

export class LoginResponse extends RegisterResponse {}
