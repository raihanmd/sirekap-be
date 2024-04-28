import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
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

import { PartaiService } from "./partai.service";
import { ResponseService } from "../common/response/response.service";
import { ValidationService } from "../common/validation/validation.service";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { DeletePartaiDto, PostPartaiDto, UpdatePartaiDto } from "./dto";
import { PartaiValidation } from "./zod";

@ApiTags("Partai")
@Controller("/v1/partai")
export class PartaiController {
  constructor(
    private readonly partaiService: PartaiService,
    private readonly responseService: ResponseService,
    private readonly validationService: ValidationService,
  ) {}

  @HttpCode(200)
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
  @Public()
  @Get("/")
  async getAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("size", new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const queryReq = {
      page: page ?? 1,
      size: size ?? 10,
    };

    const res = await this.partaiService.getAll(queryReq);
    return this.responseService.pagination(res.payload, res.meta, 200);
  }

  @HttpCode(201)
  @ApiBearerAuth()
  @ApiBody({ type: PostPartaiDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Authorization Required" })
  @Roles(["ADMIN"])
  @UseInterceptors(FileInterceptor("image"))
  @Post("/")
  async create(
    @Body() createReq: PostPartaiDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const data = {
      ...createReq,
      image,
    };

    this.validationService.validate(PartaiValidation.POST, data);
    const res = await this.partaiService.create(data);
    return this.responseService.success(res, 201);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePartaiDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Authorization Required" })
  @Roles(["ADMIN"])
  @UseInterceptors(FileInterceptor("image"))
  @Patch("/")
  async update(
    @Body() updateReq: UpdatePartaiDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const data = {
      ...updateReq,
      image,
    };

    this.validationService.validate(PartaiValidation.UPDATE, data);
    const res = await this.partaiService.update(data);
    return this.responseService.success(res, 200);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: DeletePartaiDto })
  @ApiOperation({ summary: "Authorization Required" })
  @Roles(["ADMIN"])
  @Delete("/")
  async delete(@Body() deleteReq: DeletePartaiDto) {
    this.validationService.validate(PartaiValidation.DELETE, deleteReq);
    const res = await this.partaiService.delete(deleteReq);
    return this.responseService.success(res, 200);
  }
}
