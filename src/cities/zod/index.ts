import { BadRequestException } from "@nestjs/common";
import { z } from "zod";

import { CitiesService } from "../cities.service";

export class CitiesValidation {
  constructor(private readonly citiesService: CitiesService) {}

  static QUERY = z
    .object({
      province_id: z.number().min(1).optional(),
      city_id: z.number().min(1).optional(),
    })
    .refine((data) => {
      if (data.province_id === undefined && data.city_id === undefined) {
        throw new BadRequestException(
          "At least one of the parameters 'province_id' or 'city_id' must be provided.",
        );
      }

      return true;
    });
}
