import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SwaggerAssetsModule } from "./swagger-assets/swagger-assets.module";
import { ProvincesModule } from "./provinces/provinces.module";
import { CitiesModule } from "./cities/cities.module";
import { CommonModule } from "./common/common.module";
import { PartaiModule } from "./partai/partai.module";
import { CandidatesModule } from "./candidates/candidates.module";
import { VotingsModule } from "./votings/votings.module";

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    SwaggerAssetsModule,
    ProvincesModule,
    CitiesModule,
    PartaiModule,
    CandidatesModule,
    VotingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
