import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

import { VotingsService } from "./votings.service";
import { RoleGuard } from "../common/role/role.guard";
import { ResponseService } from "../common/response/response.service";
import { Roles } from "../common/role/roles.decorator";
import { ValidationService } from "../common/validation/validation.service";
import { PostVotingEventDto } from "./dto";
import { VotingEventValidation } from "./zod";

@UseGuards(RoleGuard)
@ApiTags("Votings")
@Controller("/v1/votings")
export class VotingsController {
  constructor(
    private readonly votingsService: VotingsService,
    private readonly validationService: ValidationService,
    private readonly responseService: ResponseService,
  ) {}

  @Get("/")
  async getAll() {
    const res = await this.votingsService.getAll();
    return this.responseService.success(res, 200);
  }

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiBody({ type: PostVotingEventDto })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles(["ADMIN"])
  @Post("/")
  async create(@Body() createReq: PostVotingEventDto) {
    this.validationService.validate(VotingEventValidation.POST, createReq);

    const res = this.votingsService.create(createReq);

    return this.responseService.success(res, 201);
  }
}
