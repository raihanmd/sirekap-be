import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { VotingsService } from "./votings.service";
import { ResponseService } from "../common/response/response.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Public } from "../common/decorators/public.decorator";

@UseGuards(JwtGuard)
@ApiTags("Votings")
@Controller("/v1/votings")
export class VotingsController {
  constructor(
    private readonly votingsService: VotingsService,
    private readonly responseService: ResponseService,
  ) {}

  @Get("/")
  @Public()
  async getAll() {
    const res = await this.votingsService.getAll();
    return this.responseService.success(res, 200);
  }
}
