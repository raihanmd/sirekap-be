import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class ProvincesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}
  getAll() {
    return this.prismaService.province.findMany();
  }

  async getProvinceById(province_id: number) {
    const province = await this.prismaService.province.findFirst({
      where: {
        id: province_id,
      },
    });

    if (!province) throw new NotFoundException("Province not found");

    return province;
  }
}
