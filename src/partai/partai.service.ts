import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DeletePartaiDto, PostPartaiDto, UpdatePartaiDto } from "./dto";
import { PrismaService } from "../common/prisma/prisma.service";
import { GoogleDriveService } from "../common/google-drive/google-drive.service";

@Injectable()
export class PartaiService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly configService: ConfigService,
  ) {}

  async getAll() {
    return this.prismaService.politicalParties.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  }

  async create(data: PostPartaiDto) {
    const isPartaiExist = await this.prismaService.politicalParties.findUnique({
      where: {
        name: data.name,
      },
      select: {
        name: true,
        image: true,
      },
    });

    if (isPartaiExist) {
      throw new ForbiddenException("Partai already exist");
    }

    const image = await this.googleDriveService.upload(
      data.image,
      this.configService.get("GOOGLE_DRIVE_PARTAI_FOLDER_ID") as string,
    );

    this.logger.info("Create Partai: ", JSON.stringify(data));

    return await this.prismaService.politicalParties.create({
      data: {
        name: data.name,
        image: image?.thumbnail_link as string,
        public_id: image?.id as string,
      },
      select: {
        name: true,
        image: true,
      },
    });
  }

  async update(data: UpdatePartaiDto) {
    const partai = await this.getById(data.id);

    let updateData = {};

    if (data.image) {
      await this.googleDriveService.delete(partai.public_id);

      const image = await this.googleDriveService.upload(
        data.image,
        this.configService.get("GOOGLE_DRIVE_PARTAI_FOLDER_ID") as string,
      );

      updateData = {
        ...updateData,
        public_id: image.id,
        image: image.thumbnail_link,
      };
    }

    if (data.name) {
      updateData = { ...updateData, name: data.name };
    }

    this.logger.info("Update Partai: ", JSON.stringify(data));

    return await this.prismaService.politicalParties.update({
      where: {
        id: data.id,
      },
      data: updateData,
      select: {
        name: true,
        image: true,
      },
    });
  }

  async delete(data: DeletePartaiDto) {
    const partai = await this.getById(data.id);

    await this.googleDriveService.delete(partai.public_id);

    await this.prismaService.politicalParties.delete({
      where: {
        id: data.id,
      },
    });

    this.logger.info("Delete Partai: ", JSON.stringify(data));

    return { success: true };
  }

  async getById(id: string) {
    const partai = await this.prismaService.politicalParties.findUnique({
      where: {
        id,
      },
    });

    if (!partai) {
      throw new NotFoundException("Partai not found");
    }

    return partai;
  }
}
