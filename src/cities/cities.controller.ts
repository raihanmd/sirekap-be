import { Controller, Get, HttpCode, ParseIntPipe, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { CitiesService } from "./cities.service";
import { ResponseService } from "../common/response/response.service";
import { ValidationService } from "../common/validation/validation.service";
import { CitiesValidation } from "./zod";

@ApiTags("Cities")
@Controller("/v1/cities")
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly responseService: ResponseService,
    private readonly validationService: ValidationService,
  ) {}

  @HttpCode(200)
  @ApiQuery({
    name: "province_id",
    type: Number,
    required: false,
    example: "",
    allowReserved: true,
  })
  @ApiQuery({
    name: "city_id",
    type: Number,
    required: false,
    allowReserved: true,
    example: "",
  })
  @Get("/")
  async getAll(
    @Query("province_id", new ParseIntPipe({ optional: true }))
    province_id?: number,
    @Query("city_id", new ParseIntPipe({ optional: true })) city_id?: number,
  ) {
    const queryReq = { province_id, city_id };

    this.validationService.validate(CitiesValidation.QUERY, queryReq);

    const res = await this.citiesService.getCity(queryReq);

    return this.responseService.success(res, 200);
  }
}
