import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { UsersService } from "./users.service";
import { RoleGuard } from "../common/role/role.guard";
import { Auth } from "../common/auth/auth.decorator";
// import { Roles } from "src/role/roles.decorator";
import { ValidationService } from "../common/validation/validation.service";
import { ResponseService } from "../common/response/response.service";
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from "./dto";
import { LoginResponse, RegisterResponse } from "./response";
import { UsersValidation } from "./zod";
import { User } from "@prisma/client";

@UseGuards(RoleGuard)
@ApiTags("Users")
@Controller("/v1/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly validationService: ValidationService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(201)
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ type: RegisterResponse })
  @Post("/register")
  async register(@Body() loginReq: RegisterUserDto) {
    this.validationService.validate(UsersValidation.RESGISTER, loginReq);
    const res = await this.usersService.register(loginReq);
    return this.responseService.success(res, 201);
  }

  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: LoginResponse })
  @Post("/login")
  async login(@Body() loginReq: LoginUserDto) {
    this.validationService.validate(UsersValidation.LOGIN, loginReq);
    const res = await this.usersService.login(loginReq);
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Authorization Required" })
  @Get("/current")
  async current(@Auth() user: User) {
    const res = await this.usersService.getUserById(user.id);
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Authorization Required" })
  @Patch("/current")
  async update(@Auth() user: User, @Body() updateReq: UpdateUserDto) {
    this.validationService.validate(UsersValidation.UPDATE, updateReq);
    const res = await this.usersService.update(user, updateReq);
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Authorization Required" })
  @Delete("/current")
  async logout(@Auth() user: User) {
    const res = await this.usersService.logout(user);
    return this.responseService.success(res, 200);
  }
}
