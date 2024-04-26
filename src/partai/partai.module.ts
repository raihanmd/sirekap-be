import { Module } from "@nestjs/common";
import { PartaiService } from "./partai.service";
import { PartaiController } from "./partai.controller";

@Module({
  controllers: [PartaiController],
  providers: [PartaiService],
})
export class PartaiModule {}
