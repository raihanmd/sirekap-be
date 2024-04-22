import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { ProvincesService } from "../provinces/provinces.service";
import { CitiesService } from "../cities/cities.service";
import { AuthMiddleware } from "../common/auth/auth.middleware";

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProvincesService, CitiesService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("/v1/users/current");
  }
}
