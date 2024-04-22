import { Global, Module } from "@nestjs/common";
import { GoogleDriveService } from "./google-drive.service";

@Global()
@Module({
  providers: [GoogleDriveService],
  exports: [GoogleDriveService],
})
export class GoogleDriveModule {}
