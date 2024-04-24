import { Injectable } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { PostVotingEventDto } from "./dto";

@Injectable()
export class VotingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    // const presidens = await this.candidatesService.getAll({ type: "PRESIDEN" });

    return this.prismaService.$queryRaw`
      SELECT voting_events.start_time, voting_events.end_time, candidates.id, candidates.name, candidates.type FROM voting_events
      JOIN candidates ON candidates.type = voting_events.type
    `;
  }

  async create(data: PostVotingEventDto) {
    return this.prismaService.votingEvents.create({
      data,
    });
  }
}
