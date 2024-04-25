import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { VotingsService } from "./votings.service";
import { RoleGuard } from "../common/role/role.guard";
import { ResponseService } from "../common/response/response.service";

@UseGuards(RoleGuard)
@ApiTags("Votings")
@Controller("/v1/votings")
export class VotingsController {
  constructor(
    private readonly votingsService: VotingsService,
    private readonly responseService: ResponseService,
  ) {}

  @Get("/")
  async getAll() {
    const res = await this.votingsService.getAll();
    return this.responseService.success(res, 200);
  }
}
