import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { VotingsService } from "./votings.service";
import { ResponseService } from "../common/response/response.service";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Votings")
@Controller("/v1/votings")
export class VotingsController {
  constructor(
    private readonly votingsService: VotingsService,
    private readonly responseService: ResponseService,
  ) {}

  @Get("/global")
  @Public()
  async getAll() {
    const res = await this.votingsService.getGlobal();
    return this.responseService.success(res, 200);
  }
}
