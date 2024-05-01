import { Candidates, Prisma } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import {
  DeleteCandidatesDto,
  PatchCandidatesDto,
  PostCandidatesDto,
  QueryCandidatesParam,
} from "./dto";
import { CitiesService } from "../cities/cities.service";
import { VotingsService } from "../votings/votings.service";
import { GoogleDriveService } from "../common/google-drive/google-drive.service";

@Injectable()
export class CandidatesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly citiesService: CitiesService,
    private readonly votingsService: VotingsService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(queryReq: QueryCandidatesParam) {
    const filter: Prisma.CandidatesWhereInput[] = [];

    if (queryReq.type) {
      filter.push({ type: queryReq.type });
    }

    const skip = (queryReq.page - 1) * queryReq.size;

    const payload = (
      await this.prismaService.candidates.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          image: true,
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
          party: {
            select: {
              name: true,
            },
          },
        },
        where: {
          AND: filter,
        },
        orderBy: {
          type: "asc",
        },
        take: queryReq.size,
        skip,
      })
    ).map((data) => CandidatesService.prettyResponse(data));

    const total = await this.prismaService.candidates.count({
      where: {
        AND: filter,
      },
    });

    return {
      payload,
      meta: {
        current_page: queryReq.page,
        size: queryReq.size,
        total_page: Math.ceil(total / queryReq.size),
      },
    };
  }

  async create(data: PostCandidatesDto) {
    const image = await this.googleDriveService.upload(
      data.image,
      this.configService.get("GOOGLE_DRIVE_CANDIDATE_FOLDER_ID") as string,
    );

    await this.citiesService.isValidCity({
      province_id: data.province_id,
      city_id: data.city_id,
    });

    const votingEventsId = await this.votingsService.getId({
      type: data.type,
      province_id: data.province_id,
      city_id: data.city_id,
    });

    this.logger.info(`Create Candidates: ${data.name}`);

    return CandidatesService.prettyResponse(
      await this.prismaService.candidates.create({
        data: {
          ...data,
          voting_events_id: votingEventsId,
          image: image?.thumbnail_link as string,
          public_id: image?.id as string,
        },
        select: {
          name: true,
          type: true,
          image: true,
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
          party: {
            select: {
              name: true,
            },
          },
        },
      }),
    );
  }

  async update(data: PatchCandidatesDto) {
    const candidate = await this.getById(data.id);

    let updateData: Partial<Candidates> = {};

    if (data.image) {
      await this.googleDriveService.delete(candidate.public_id);

      const image = await this.googleDriveService.upload(
        data.image,
        this.configService.get("GOOGLE_DRIVE_CANDIDATE_FOLDER_ID") as string,
      );

      updateData = {
        public_id: image.id as string,
        image: image.thumbnail_link as string,
      };
    }

    if (data.type) {
      const votingEventsId = await this.votingsService.getId({
        type: data.type,
        province_id: data.province_id as number,
        city_id: data.city_id as number,
      });

      updateData = {
        type: data.type,
        voting_events_id: votingEventsId,
        province_id: data.province_id,
        city_id: data.city_id,
      };
    }

    updateData = {
      ...updateData,
      ...(data.name && { name: data.name }),
      ...(data.party_id && { party_id: data.party_id }),
    };

    this.logger.info(`Update Candidates: ${candidate.name}`);

    return CandidatesService.prettyResponse(
      await this.prismaService.candidates.update({
        where: { id: data.id },
        data: updateData,
        select: {
          name: true,
          type: true,
          image: true,
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
          party: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
    );
  }

  async delete(data: DeleteCandidatesDto) {
    const candidate = await this.getById(data.id);

    await this.googleDriveService.delete(candidate.public_id);

    await this.prismaService.candidates.delete({
      where: { id: data.id },
    });

    this.logger.info(`Delete Candidates: ${candidate.name}`);

    return { success: true };
  }

  async getById(id: string) {
    const candidate = await this.prismaService.candidates.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException("Candidate not found");
    }

    return candidate;
  }

  static prettyResponse(data: any) {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      image: data.image,
      province: data.province?.name,
      city: data.city?.name,
      party: data.party?.name,
      party_image: data.party?.image,
    };
  }
}
