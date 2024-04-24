import { CandidatesType } from "@prisma/client";
import { z } from "zod";

export class VotingEventValidation {
  static POST = z.object({
    type: z.nativeEnum(CandidatesType),
    start_time: z.number().int(),
    end_time: z.number().int(),
  });
}
