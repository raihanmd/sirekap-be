import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: () => void) {
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader
      ? authorizationHeader.split(" ")[1]
      : null;

    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    const user = await this.prismaService.user.findFirst({
      where: { token },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    req.user = { id: user.id, role: user.role };
    next();
  }
}
