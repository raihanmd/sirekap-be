import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [TestService],
})
export class TestModule {}
