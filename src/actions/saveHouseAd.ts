"use server";

import * as z from "zod";
import { HouseAdSchema } from "@/schema";
import { createHouseAd } from "@/prisma/db/houseAds";

export default async function saveHouseAd(values: z.infer<typeof HouseAdSchema>, savedBy: string[], postedBy: string) {
  const validatedFields = HouseAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const createdId = await createHouseAd({ ...dbData, savedBy, postedBy, reports: [] });
    return { data: createdId };
  } catch (error: any) {
    return { error: "Could not create Ad. Please try again" };
  }
}
