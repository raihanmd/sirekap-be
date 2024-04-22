import { Injectable } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { PostVotingEventDto } from "./dto";

@Injectable()
export class VotingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.votingEvents.findMany();
  }

  async create(data: PostVotingEventDto) {
    return this.prismaService.votingEvents.create({
      data,
    });
  }
}
