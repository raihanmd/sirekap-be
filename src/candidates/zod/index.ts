import { CandidatesType } from "@prisma/client";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export class CandidatesValidation {
  static POST = z
    .object({
      name: z.string().min(3).max(255),
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
    })
    .superRefine((data, ctx) => {
      if (
        data.type === CandidatesType.PRESIDEN ||
        data.type === CandidatesType.WAKIL_PRESIDEN ||
        data.type === CandidatesType.DPR
      ) {
        if (data.province_id !== 99 && data.city_id !== 99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Province and city must be 99",
          });
        }
      }

      if (data.type === CandidatesType.DPD) {
        if (data.city_id !== 99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "City must be 99",
          });
        }
      }
    });

  static QUERY = z.object({
    type: z.nativeEnum(CandidatesType).optional(),
    size: z.number(),
    page: z.number(),
  });

  static PATCH = z
    .object({
      id: z.string().cuid(),
      name: z.string().min(3).max(255).optional(),
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
    })
    .superRefine((data, ctx) => {
      if (
        data.type !== undefined ||
        data.province_id !== undefined ||
        data.city_id !== undefined
      ) {
        if (
          data.type === undefined ||
          data.province_id === undefined ||
          data.city_id === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Field type, province_id and city_id must be provided",
          });
        }
      }

      if (
        data.type === CandidatesType.PRESIDEN ||
        data.type === CandidatesType.WAKIL_PRESIDEN ||
        data.type === CandidatesType.DPR
      ) {
        if (data.province_id !== 99 && data.city_id !== 99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Province and city must be 99",
          });
        }
      }

      if (data.type === CandidatesType.DPD) {
        if (data.city_id !== 99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "City must be 99",
          });
        }
      }
    });

  static DELETE = z.object({
    id: z.string().cuid(),
  });
}
