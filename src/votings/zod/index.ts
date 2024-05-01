import { z } from "zod";

export class VotingsValidation {
  static QUERY_DPD = z.object({
    province_id: z.number().min(11).max(94),
  });

  static QUERY_DPRD = z.object({
    province_id: z.number().min(11).max(94),
    city_id: z.number().min(1101).max(9471),
  });
}
