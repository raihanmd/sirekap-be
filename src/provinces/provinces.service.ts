import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class ProvincesService {
  constructor(private readonly prismaService: PrismaService) {}
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
