import { Candidates, CandidatesType } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { CandidatesService } from "src/candidates/candidates.service";
import { QueryDpdParam, QueryDprdParam } from "./dto";

@Injectable()
export class VotingsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  private async getVotingEventsByTypeWithCandidates(
    filter: CandidatesType | any,
  ) {
    const votingEvents = await this.prismaService.votingEvents.findFirst({
      select: {
        id: true,
        type: true,
        start_time: true,
        end_time: true,
        province: {
          select: {
            name: true,
          },
        },
        city: {
          select: {
            name: true,
          },
        },
        candidates: {
          select: {
            name: true,
            type: true,
            image: true,
            party: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      where: filter,
    });

    if (!votingEvents) throw new NotFoundException("Voting Events not found");

    return {
      id: votingEvents.id,
      type: votingEvents.type,
      start_time: votingEvents.start_time,
      end_time: votingEvents.end_time,
      province: votingEvents.province.name,
      city: votingEvents.city.name,
      candidates: votingEvents.candidates.map((candidate) =>
        CandidatesService.prettyResponse(candidate),
      ),
    };
  }

  async getPresiden() {
    return this.getVotingEventsByTypeWithCandidates({
      type: CandidatesType.PRESIDEN,
    });
  }

  async getWakilPresiden() {
    return this.getVotingEventsByTypeWithCandidates(
      CandidatesType.WAKIL_PRESIDEN,
    );
  }

  async getDpr() {
    return this.getVotingEventsByTypeWithCandidates({
      type: CandidatesType.DPR,
    });
  }

  async getDpd(queryReq: QueryDpdParam) {
    return this.getVotingEventsByTypeWithCandidates({
      AND: [{ type: CandidatesType.DPD }, queryReq],
    });
  }

  async getDprd(queryReq: QueryDprdParam) {
    return this.getVotingEventsByTypeWithCandidates({
      AND: [{ type: CandidatesType.DPRD }, queryReq],
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
            type,
            province_id,
            city_id,
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
