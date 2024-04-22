import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseService {
  success(payload: any, statusCode: number) {
    return {
      payload,
      statusCode,
    };
  }
}
