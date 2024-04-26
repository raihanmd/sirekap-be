import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CitiesService } from "../cities/cities.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, CitiesService],
})
export class UsersModule {}
