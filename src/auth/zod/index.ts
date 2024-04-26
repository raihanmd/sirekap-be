import { z } from "zod";

export class AuthValidation {
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
}
