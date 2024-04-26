import { User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import * as bcrypt from "bcrypt";
import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { UpdateUserDto } from "./dto";
import { CitiesService } from "../cities/cities.service";

@Injectable()
export class UsersService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly citiesService: CitiesService,
  ) {}

  async getUserById(id: string) {
    return await this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: {
        username: true,
        full_name: true,
        role: true,
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
        votes: true,
      },
    });
  }

  async update(user: Pick<User, "id">, data: UpdateUserDto) {
    const updateData: Partial<User> = {};

    if (data.username) updateData.username = data.username;

    if (data.password)
      updateData.password = await bcrypt.hash(data.password, 10);

    if (data.full_name) updateData.full_name = data.full_name;

    if (data.date_of_birth) updateData.date_of_birth = data.date_of_birth;

    if (data.province_id) {
      await this.citiesService.isValidCity({
        province_id: data.province_id,
        city_id: updateData.city_id,
      });

      updateData.province_id = data.province_id;
    }

    if (data.city_id) {
      await this.citiesService.isValidCity({
        province_id: updateData.province_id,
        city_id: data.city_id,
      });

      updateData.city_id = data.city_id;
    }

    this.logger.info(`Update User: ${JSON.stringify(user)}`);

    return await this.prismaService.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        username: true,
        full_name: true,
        role: true,
        province: { select: { name: true } },
        city: { select: { name: true } },
      },
    });
  }

  async logout(user: User) {
    this.logger.info(`Logout User: ${JSON.stringify(user)}`);

    return { success: true };
  }
}
