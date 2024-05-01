import { BadRequestException } from "@nestjs/common";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export class PartaiValidation {
  static POST = z.object({
    name: z.string().min(1).max(50),
    image: z.any().superRefine((f, ctx) => {
      if (!ACCEPTED_MIME_TYPES.includes(f.mimetype)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
            ", ",
          )}] but was ${f.mimetype}`,
        });
      }
      if (f.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: "array",
          message: `The file must not be larger than ${MAX_FILE_SIZE} bytes: ${f.size}`,
          maximum: MAX_FILE_SIZE,
          inclusive: true,
        });
      }
    }),
  });

  static DELETE = z.object({
    id: z.string().min(1),
  });

  static UPDATE = z
    .object({
      id: z.string().min(1),
      name: z.string().min(1).max(50).optional(),
      image: z
        .any()
        .superRefine((f, ctx) => {
          if (!ACCEPTED_MIME_TYPES.includes(f.mimetype)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                ", ",
              )}] but was ${f.mimetype}`,
            });
          }
          if (f.size > MAX_FILE_SIZE) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              type: "array",
              message: `The file must not be larger than ${MAX_FILE_SIZE} bytes: ${f.size}`,
              maximum: MAX_FILE_SIZE,
              inclusive: true,
            });
          }
        })
        .optional(),
    })
    .refine((data) => {
      if (data.name === undefined && data.image === undefined) {
        throw new BadRequestException(
          "At least one of the parameters 'name' or 'image' must be provided.",
        );
      }
      return true;
    });
}
