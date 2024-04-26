import { Module } from "@nestjs/common";

import { VotingsService } from "./votings.service";
import { VotingsController } from "./votings.controller";

@Module({
  controllers: [VotingsController],
  providers: [VotingsService],
})
export class VotingsModule {}
