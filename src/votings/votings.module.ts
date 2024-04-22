import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { VotingsService } from "./votings.service";
import { VotingsController } from "./votings.controller";
import { AuthMiddleware } from "../common/auth/auth.middleware";

@Module({
  controllers: [VotingsController],
  providers: [VotingsService],
})
export class VotingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("/v1/votings");
  }
}
