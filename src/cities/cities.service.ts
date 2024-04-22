import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";

type QueryCityParam = {
  province_id?: number;
  city_id?: number;
};
@Injectable()
export class CitiesService {
  constructor(private readonly prismaService: PrismaService) {}
  async getCity(queryReq: QueryCityParam) {
    const filters: Array<any> = [];

    if (queryReq.province_id) {
      filters.push({
        province_id: queryReq.province_id,
      });
    }

    if (queryReq.city_id) {
      filters.push({
        id: queryReq.city_id,
      });
    }

    const cities = await this.prismaService.city.findMany({
      where: {
        AND: filters,
      },
    });

    if (cities.length === 0) {
      throw new NotFoundException("Data not found");
    }

    return cities;
  }

  async isValidCity({ province_id, city_id }: QueryCityParam) {
    const city = await this.prismaService.city.findFirst({
      where: {
        id: city_id,
        province_id,
      },
    });

    if (!city) throw new NotFoundException("City not found");

    return city;
  }
}
