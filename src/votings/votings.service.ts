import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { CandidatesService } from "../candidates/candidates.service";

@Injectable()
export class VotingsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly candidatesService: CandidatesService,
  ) {}

  getAll() {
    return this.prismaService.votingEvents.findMany({
      include: {
        candidates: true,
      },
    });
  }
}
