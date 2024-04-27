import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { User } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";
import { ValidationService } from "../common/validation/validation.service";
import { ResponseService } from "../common/response/response.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { UpdateUserDto } from "./dto";
import { UsersValidation } from "./zod";

@UseGuards(JwtGuard)
@ApiTags("Users")
@Controller("/v1/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly validationService: ValidationService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Authorization Required" })
  @Get("/current")
  async current(@Req() req: Request) {
    const { id } = req.user as User;
    const res = await this.usersService.getUserById(id);
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Authorization Required" })
  @Patch("/current")
  async update(@Req() req: Request, @Body() updateReq: UpdateUserDto) {
    this.validationService.validate(UsersValidation.UPDATE, updateReq);
    const res = await this.usersService.update(req.user as User, updateReq);
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Authorization Required" })
  @Delete("/current")
  async logout(@Req() req: Request) {
    const res = await this.usersService.logout(req.user as User);
    return this.responseService.success(res, 200);
  }
}
