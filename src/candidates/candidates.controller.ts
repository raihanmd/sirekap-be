import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CandidatesType } from "@prisma/client";

import { CandidatesService } from "./candidates.service";
import { ResponseService } from "../common/response/response.service";
import {
  DeleteCandidatesDto,
  PatchCandidatesDto,
  PostCandidatesDto,
} from "./dto";
import { ValidationService } from "../common/validation/validation.service";
import { CandidatesValidation } from "./zod";
import { Roles } from "../common/role/roles.decorator";
import { RoleGuard } from "../common/role/role.guard";
import { JwtGuard } from "../auth/guards/jwt.guard";

@UseGuards(RoleGuard)
@ApiTags("Candidates")
@Controller("/v1/candidates")
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly responseService: ResponseService,
    private readonly validationService: ValidationService,
  ) {}

  @HttpCode(200)
  @ApiQuery({
    name: "type",
    type: String,
    required: false,
    allowReserved: true,
    example: "PRESIDEN",
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    allowReserved: true,
  })
  @ApiQuery({
    name: "size",
    type: Number,
    required: false,
    allowReserved: true,
  })
  @Get("/")
  async getAll(
    @Query("type", new ParseEnumPipe(CandidatesType, { optional: true }))
    type?: CandidatesType,
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("size", new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const queryReq = {
      type: type?.toUpperCase() as CandidatesType,
      page: page ?? 1,
      size: size ?? 10,
    };

    this.validationService.validate(CandidatesValidation.QUERY, queryReq);
    const res = await this.candidatesService.getAll(queryReq);

    return this.responseService.pagination(res.payload, res.meta, 200);
  }

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiBody({ type: PostCandidatesDto })
  @ApiOperation({ summary: "Authorization Required" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  @UseGuards(JwtGuard)
  @Roles(["ADMIN"])
  @Post("/")
  async create(
    @Body("province_id", ParseIntPipe) province_id: number,
    @Body("city_id", ParseIntPipe) city_id: number,
    @Body() createReq: PostCandidatesDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const data: PostCandidatesDto = {
      ...createReq,
      province_id,
      city_id,
      image,
    };

    this.validationService.validate(CandidatesValidation.POST, data);

    const res = await this.candidatesService.create(data);

    return this.responseService.success(res, 201);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: PatchCandidatesDto })
  @ApiOperation({ summary: "Authorization Required" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  @UseGuards(JwtGuard)
  @Roles(["ADMIN"])
  @Patch("/")
  async update(
    @Body("province_id", new ParseIntPipe({ optional: true }))
    province_id: number,
    @Body("city_id", new ParseIntPipe({ optional: true }))
    city_id: number,
    @Body() updateReq: PatchCandidatesDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const data: PatchCandidatesDto = {
      ...updateReq,
      province_id,
      city_id,
      image,
    };

    this.validationService.validate(CandidatesValidation.PATCH, data);

    const res = await this.candidatesService.update(data);

    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: DeleteCandidatesDto })
  @ApiOperation({ summary: "Authorization Required" })
  @UseGuards(JwtGuard)
  @Roles(["ADMIN"])
  @Delete("/")
  async delete(@Body() deleteReq: DeleteCandidatesDto) {
    this.validationService.validate(CandidatesValidation.DELETE, deleteReq);

    const res = await this.candidatesService.delete(deleteReq);

    return this.responseService.success(res, 200);
  }
}
