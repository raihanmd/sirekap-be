import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Logger } from "winston";
import { UserRole } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

import { LoginUserDto, RegisterUserDto } from "./dto";
import { PrismaService } from "../common/prisma/prisma.service";
import { CitiesService } from "../cities/cities.service";
import { ProvincesService } from "../provinces/provinces.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly provincesService: ProvincesService,
    private readonly citiesService: CitiesService,
    private readonly jwtService: JwtService,
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

    this.logger.info(`Register User: ${data.username}`);

    const user = await this.prismaService.user.create({
      data: {
        username: data.username as string,
        full_name: data.full_name,
        password: data.password,
        role: UserRole.REGISTERED_USER,
        date_of_birth: data.date_of_birth,
        city_id: data.city_id,
        province_id: data.province_id,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return {
      token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        role: user.role,
      }),
    };
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

    this.logger.info(`Login User: ${user.username}`);

    return {
      token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        role: user.role,
      }),
    };
  }
}
