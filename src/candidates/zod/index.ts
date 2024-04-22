import { z } from "zod";
import { CandidatesType } from "../dto";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export class CandidatesValidation {
  static POST = z.object({
    name: z.string().min(3),
    party_id: z.string().cuid(),
    province_id: z.number(),
    city_id: z.number(),
    type: z.nativeEnum(CandidatesType),
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

  static QUERY = z.object({
    type: z.string().optional(),
  });

  static PATCH = z.object({
    id: z.string().cuid(),
    name: z.string().min(3).optional(),
    party_id: z.string().cuid().optional(),
    province_id: z.number().optional(),
    city_id: z.number().optional(),
    type: z.nativeEnum(CandidatesType).optional(),
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
  });

  static DELETE = z.object({
    id: z.string().cuid(),
  });
}
