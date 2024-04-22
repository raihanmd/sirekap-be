import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth, google } from "googleapis";

import { v4 } from "uuid";
import * as stream from "stream";

@Injectable()
export class GoogleDriveService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private auth!: Auth.GoogleAuth;

  async onModuleInit() {
    const credentials = JSON.parse(
      this.configService.get("GOOGLE_CREDENTIALS") as string,
    );

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
  }

  async upload(file: Express.Multer.File, folderId: string) {
    try {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      const { data } = await google
        .drive({ version: "v3", auth: this.auth })
        .files.create({
          media: {
            mimeType: "image/webp",
            body: bufferStream,
          },
          requestBody: {
            name: v4() + ".webp",
            parents: [folderId],
          },
          fields: "id,thumbnailLink",
        });

      return {
        id: data.id,
        thumbnail_link: data.thumbnailLink,
      };
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException("Failed to upload image");
    }
  }

  async delete(fileId: string) {
    try {
      await google.drive({ version: "v3", auth: this.auth }).files.delete({
        fileId: fileId,
      });
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException("Failed to upload image");
    }
  }
}
