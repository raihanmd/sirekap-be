import { User, UserRole } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../common/prisma/prisma.service";
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from "./dto";
import { ProvincesService } from "../provinces/provinces.service";
import { CitiesService } from "../cities/cities.service";

@Injectable()
export class UsersService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly provincesService: ProvincesService,
    private readonly citiesService: CitiesService,
  ) {}

  async register(data: RegisterUserDto) {
    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        username: data.username,
      },
    });

    if (isUserExist) throw new ForbiddenException("User already exist");

    const isValidProvince = await this.provincesService.getProvinceById(
      data.province_id,
    );

    if (!isValidProvince) throw new NotFoundException("Province not found");

    const isValidCity = await this.citiesService.isValidCity({
      province_id: data.province_id,
      city_id: data.city_id,
    });

    if (!isValidCity) throw new NotFoundException("City not found");

    data.password = await bcrypt.hash(data.password as string, 10);
    data.token = v4();

    this.logger.info("Register User: ", JSON.stringify(data.username));

    return this.prismaService.user.create({
      data: {
        username: data.username as string,
        full_name: data.full_name,
        password: data.password,
        token: data.token,
        role: UserRole.REGISTERED_USER,
        date_of_birth: data.date_of_birth,
        city_id: data.city_id,
        province_id: data.province_id,
      },
      select: {
        username: true,
        token: true,
      },
    });
  }

  async login(data: LoginUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: data.username,
      },
    });

    if (!user) throw new UnauthorizedException("Username or password wrong");

    const isMatch = await bcrypt.compare(
      data.password as string,
      user.password,
    );

    if (!isMatch) throw new UnauthorizedException("Username or password wrong");

    data.token = v4();

    this.logger.info("Login User: ", JSON.stringify(data.username));

    return await this.prismaService.user.update({
      data: {
        token: data.token,
      },
      where: {
        id: user.id,
      },
      select: {
        username: true,
        token: true,
      },
    });
  }

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

  async update(user: User, data: UpdateUserDto) {
    if (data.username) user.username = data.username;

    if (data.password) user.password = await bcrypt.hash(data.password, 10);

    if (data.full_name) user.full_name = data.full_name;

    if (data.date_of_birth) user.date_of_birth = data.date_of_birth;

    if (data.province_id) {
      await this.citiesService.isValidCity({
        province_id: data.province_id,
        city_id: user.city_id,
      });

      user.province_id = data.province_id;
    }

    if (data.city_id) {
      await this.citiesService.isValidCity({
        province_id: user.province_id,
        city_id: data.city_id,
      });

      user.city_id = data.city_id;
    }

    this.logger.info("Update User: ", JSON.stringify(user.username));

    return await this.prismaService.user.update({
      where: { id: user.id },
      data: user,
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
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });

    this.logger.info("Logout User: ", JSON.stringify(user.username));

    return { success: true };
  }
}
