import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthValidation } from "./zod";
import { LoginUserDto, RegisterUserDto } from "./dto";
import { LoginResponse, RegisterResponse } from "./response";
import { AuthService } from "./auth.service";
import { Public } from "../common/decorators/public.decorator";
import { ValidationService } from "../common/validation/validation.service";
import { ResponseService } from "../common/response/response.service";

@ApiTags("Auth")
@Controller("/v1/auth")
export class AuthController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly responseService: ResponseService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(201)
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ type: RegisterResponse })
  @Public()
  @Post("/register")
  async register(@Body() loginReq: RegisterUserDto) {
    this.validationService.validate(AuthValidation.RESGISTER, loginReq);
    const res = await this.authService.register(loginReq);
    return this.responseService.success(res, 201);
  }

  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: LoginResponse })
  @Public()
  @Post("/login")
  async login(@Body() loginReq: LoginUserDto) {
    this.validationService.validate(AuthValidation.LOGIN, loginReq);
    const res = await this.authService.login(loginReq);
    return this.responseService.success(res, 200);
  }
}
