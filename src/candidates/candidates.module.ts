import { Module } from "@nestjs/common";
import { CandidatesService } from "./candidates.service";
import { CandidatesController } from "./candidates.controller";
import { CitiesService } from "../cities/cities.service";
import { VotingsService } from "../votings/votings.service";

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, CitiesService, VotingsService],
})
export class CandidatesModule {}
