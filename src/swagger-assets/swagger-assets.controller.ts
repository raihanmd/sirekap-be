import { Controller, Get, NotFoundException, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiExcludeController } from "@nestjs/swagger";

import { Public } from "../common/decorators/public.decorator";

@ApiExcludeController()
@Controller("/v1")
export class SwaggerAssetsController {
  @Public()
  @Get("/swagger-ui.css")
  async getSwaggerCss(@Res() res: Response) {
    try {
      const swaggerCssUrl =
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui.min.css";

      const response = await fetch(swaggerCssUrl);

      res.setHeader("Content-Type", "text/css");

      res.send(await response.text());
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Public()
  @Get("/swagger-ui-standalone-preset.js")
  async getSwaggerStandAlone(@Res() res: Response) {
    try {
      const swaggerStandaloneUrl =
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui-standalone-preset.min.js";

      const response = await fetch(swaggerStandaloneUrl);

      res.setHeader("Content-Type", "application/javascript");

      res.send(await response.text());
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Public()
  @Get("/swagger-ui-bundle.js")
  async getSwaggerBundle(@Res() res: Response) {
    try {
      const swaggerBundleUrl =
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui-bundle.min.js";

      const response = await fetch(swaggerBundleUrl);

      res.setHeader("Content-Type", "application/javascript");

      res.send(await response.text());
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
