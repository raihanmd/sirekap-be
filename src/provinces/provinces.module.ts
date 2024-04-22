import { Module } from "@nestjs/common";
import { ProvincesService } from "./provinces.service";
import { ProvincesController } from "./provinces.controller";

@Module({
  controllers: [ProvincesController],
  providers: [ProvincesService],
})
export class ProvincesModule {}
