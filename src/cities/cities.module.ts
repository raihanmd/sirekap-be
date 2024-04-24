import { Global, Module } from "@nestjs/common";
import { CitiesService } from "./cities.service";
import { CitiesController } from "./cities.controller";

@Global()
@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
