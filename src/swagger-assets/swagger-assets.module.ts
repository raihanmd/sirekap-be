import { Module } from "@nestjs/common";
import { SwaggerAssetsController } from "./swagger-assets.controller";

@Module({
  controllers: [SwaggerAssetsController],
})
export class SwaggerAssetsModule {}
