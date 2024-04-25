import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { Candidates, CandidatesType } from "@prisma/client";

@Injectable()
export class VotingsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  getAll() {
    return this.prismaService.votingEvents.findMany({
      include: {
        candidates: true,
      },
      where: {
        type: "PRESIDEN",
      },
    });
  }

  async getId({
    type,
    province_id,
    city_id,
  }: Pick<Candidates, "type" | "province_id" | "city_id">) {
    const votingEvents = await this.prismaService.votingEvents.findFirst({
      where: {
        AND: [
          {
            type: type === CandidatesType.WAKIL_PRESIDEN ? "PRESIDEN" : type,
            province_id: province_id,
            city_id: city_id,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!votingEvents) {
      throw new NotFoundException("Voting Events not found");
    }

    return votingEvents.id;
  }
}
