import { z } from "zod";

export class UsersValidation {
  static LOGIN = z.object({
    username: z.string().min(3).max(15),
    password: z.string(),
  });

  static RESGISTER = z.object({
    username: z.string().min(3).max(15),
    password: z.string().min(8),
    full_name: z.string().min(8),
    province_id: z.number(),
    city_id: z.number(),
    date_of_birth: z.number(),
  });

  static UPDATE = z.object({
    username: z.string().min(3).max(15).optional(),
    password: z.string().min(8).optional(),
    full_name: z.string().min(8).optional(),
    province_id: z.number().optional(),
    city_id: z.number().optional(),
    date_of_birth: z.number().optional(),
  });
}
