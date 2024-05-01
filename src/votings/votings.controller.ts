import { Controller, Get, HttpCode, ParseIntPipe, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { VotingsService } from "./votings.service";
import { ResponseService } from "../common/response/response.service";
import { Public } from "../common/decorators/public.decorator";
import { ValidationService } from "../common/validation/validation.service";
import { VotingsValidation } from "./zod";

@ApiTags("Votings")
@Controller("/v1/votings")
export class VotingsController {
  constructor(
    private readonly votingsService: VotingsService,
    private readonly responseService: ResponseService,
    private readonly validationService: ValidationService,
  ) {}

  @HttpCode(200)
  @Public()
  @Get("/presiden")
  async getPresiden() {
    const res = await this.votingsService.getPresiden();
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @Public()
  @Get("/wakil-presiden")
  async getWakilPresiden() {
    const res = await this.votingsService.getWakilPresiden();
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @Public()
  @Get("/dpr")
  async getDpr() {
    const res = await this.votingsService.getDpr();
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiQuery({
    name: "province_id",
    type: String,
  })
  @Public()
  @Get("/dpd")
  async getDpd(@Query("province_id", ParseIntPipe) province_id: number) {
    this.validationService.validate(VotingsValidation.QUERY_DPD, {
      province_id,
    });
    const res = await this.votingsService.getDpd({ province_id });
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiQuery({
    name: "province_id",
    type: String,
  })
  @ApiQuery({
    name: "city_id",
    type: String,
  })
  @Public()
  @Get("/dprd")
  async getDprd(
    @Query("province_id", ParseIntPipe) province_id: number,
    @Query("city_id", ParseIntPipe) city_id: number,
  ) {
    this.validationService.validate(VotingsValidation.QUERY_DPRD, {
      province_id,
      city_id,
    });
    const res = await this.votingsService.getDprd({ province_id, city_id });
    return this.responseService.success(res, 200);
  }
}
