import { z } from "zod";

export class VotingEventValidation {
  static POST = z.object({
    name: z.string(),
    type: z.string(),
    start_time: z.number().int(),
    end_time: z.number().int(),
  });
}
