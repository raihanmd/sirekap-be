import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { PartaiService } from "./partai.service";
import { PartaiController } from "./partai.controller";
import { AuthMiddleware } from "../common/auth/auth.middleware";

@Module({
  controllers: [PartaiController],
  providers: [PartaiService],
})
export class PartaiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "/v1/partai", method: RequestMethod.POST },
        { path: "/v1/partai", method: RequestMethod.PATCH },
        { path: "/v1/partai", method: RequestMethod.DELETE },
      );
  }
}
