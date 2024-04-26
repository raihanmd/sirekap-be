import { z } from "zod";

export class UsersValidation {
  static UPDATE = z.object({
    username: z.string().min(3).max(15).optional(),
    password: z.string().min(8).optional(),
    full_name: z.string().min(8).optional(),
    province_id: z.number().optional(),
    city_id: z.number().optional(),
    date_of_birth: z.number().optional(),
  });
}
