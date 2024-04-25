import { Injectable } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { CandidatesService } from "../candidates/candidates.service";

@Injectable()
export class VotingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly candidatesService: CandidatesService,
  ) {}

  async getAll() {
    const presiden = await this.candidatesService.getAll({
      OR: [{ type: "PRESIDEN" }, { type: "WAKIL_PRESIDEN" }],
    });
    const dpr = await this.candidatesService.getAll({ type: "DPR" });
    const dpd = await this.candidatesService.getAll({ type: "DPD" });

    const votingEvents: any = await this.prismaService.votingEvents.findMany({
      orderBy: {
        type: "asc",
      },
    });

    votingEvents[0].candidates = dpd;
    votingEvents[1].candidates = dpr;
    votingEvents[2].candidates = presiden;

    return votingEvents;
  }
}
