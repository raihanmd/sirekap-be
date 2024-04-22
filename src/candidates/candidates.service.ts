import { ConfigService } from "@nestjs/config";
import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import {
  DeleteCandidatesDto,
  PatchCandidatesDto,
  PostCandidatesDto,
} from "./dto";
import { CitiesService } from "../cities/cities.service";
import { GoogleDriveService } from "../common/google-drive/google-drive.service";

export type QueryCandidatesParam = {
  type?: string;
};

@Injectable()
export class CandidatesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly citiesService: CitiesService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(data: QueryCandidatesParam) {
    const filters = data.type ? { type: data.type } : {};

    return this.prismaService.candidates.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        image: true,
        public_id: true,
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
      where: filters,
      orderBy: {
        type: "asc",
      },
    });
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

    return this.prismaService.candidates.create({
      data: {
        ...data,
        image: image?.thumbnail_link as string,
        public_id: image?.id as string,
      },
      select: {
        name: true,
        type: true,
        image: true,
        public_id: true,
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
    });
  }

  async update(data: PatchCandidatesDto) {
    const candidate = await this.getById(data.id);

    let updateData = {};

    if (data.province_id !== undefined || data.city_id !== undefined) {
      await this.citiesService.isValidCity({
        province_id: data.province_id,
        city_id: data.city_id,
      });
    }

    if (data.image) {
      await this.googleDriveService.delete(candidate.public_id);

      const image = await this.googleDriveService.upload(
        data.image,
        this.configService.get("GOOGLE_DRIVE_CANDIDATE_FOLDER_ID") as string,
      );

      updateData = {
        public_id: image.id,
        image: image.thumbnail_link,
      };
    }

    updateData = {
      ...updateData,
      ...(data.name && { name: data.name }),
      ...(data.party_id && { party_id: data.party_id }),
      ...(data.province_id && { province_id: data.province_id }),
      ...(data.city_id && { city_id: data.city_id }),
      ...(data.type && { type: data.type }),
    };

    return this.prismaService.candidates.update({
      where: { id: data.id },
      data: updateData,
      select: {
        name: true,
        type: true,
        image: true,
        public_id: true,
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
    });
  }

  async delete(data: DeleteCandidatesDto) {
    const candidate = await this.getById(data.id);

    await this.googleDriveService.delete(candidate.public_id);

    await this.prismaService.candidates.delete({
      where: { id: data.id },
    });

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
}
