import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseService {
  success(payload: any, statusCode: number) {
    return {
      statusCode,
      payload,
    };
  }

  pagination(payload: any, meta: any, statusCode: number) {
    return {
      statusCode,
      payload,
      meta,
    };
  }
}
