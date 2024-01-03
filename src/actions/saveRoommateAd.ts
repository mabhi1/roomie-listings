"use server";

import * as z from "zod";
import { RoommateAdSchema } from "@/schema";
import { createRoommateAd } from "@/prisma/db/roommaateAds";

export default async function saveRoommateAd(
  values: z.infer<typeof RoommateAdSchema>,
  savedBy: string[],
  postedBy: string
) {
  const validatedFields = RoommateAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const createdId = await createRoommateAd({ ...dbData, savedBy, postedBy });
    return { data: createdId };
  } catch (error: any) {
    return { error: "Could not create Ad. Please try again" };
  }
}
