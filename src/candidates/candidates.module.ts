import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CandidatesService } from "./candidates.service";
import { CandidatesController } from "./candidates.controller";
import { AuthMiddleware } from "../common/auth/auth.middleware";
import { CitiesService } from "../cities/cities.service";

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, CitiesService],
})
export class CandidatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "/v1/candidates", method: RequestMethod.POST },
        { path: "/v1/candidates", method: RequestMethod.PATCH },
        { path: "/v1/candidates", method: RequestMethod.DELETE },
      );
  }
}
