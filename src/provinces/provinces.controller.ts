import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ProvincesService } from "./provinces.service";
import { ResponseService } from "../common/response/response.service";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Provinces")
@Controller("/v1/provinces")
export class ProvincesController {
  constructor(
    private readonly provincesService: ProvincesService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(200)
  @Public()
  @Get("/")
  async getAll() {
    const res = await this.provincesService.getAll();
    return this.responseService.success(res, 200);
  }
}
