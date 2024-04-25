import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import { VotingsService } from "./votings.service";
import { VotingsController } from "./votings.controller";
import { AuthMiddleware } from "../common/auth/auth.middleware";

@Module({
  controllers: [VotingsController],
  providers: [VotingsService],
})
export class VotingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "/v1/votings", method: RequestMethod.POST },
        { path: "/v1/votings", method: RequestMethod.PATCH },
        { path: "/v1/votings", method: RequestMethod.DELETE },
      );
  }
}
