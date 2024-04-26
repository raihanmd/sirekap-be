import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class TestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async deleteAll() {
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  async getUser() {
    return this.prismaService.user.findFirst({
      where: {
        username: "test",
      },
    });
  }

  async createUser() {
    const user = await this.prismaService.user.create({
      data: {
        username: "test",
        password: await bcrypt.hash("test", 10),
        full_name: "testtest",
        date_of_birth: 0,
        city_id: 3207,
        province_id: 32,
        role: "REGISTERED_USER",
      },
    });

    return this.jwtService.sign({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  }
}
