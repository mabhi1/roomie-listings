"use server";

import * as z from "zod";
import { RoommateAdSchema } from "@/schema";
import { createRoommateAd, reportRoommateById, saveRoommateByUser } from "@/prisma/db/roommaateAds";
import { revalidatePath } from "next/cache";

export async function createRoommate(values: z.infer<typeof RoommateAdSchema>, savedBy: string[], postedBy: string) {
  const validatedFields = RoommateAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const createdId = await createRoommateAd({ ...dbData, savedBy, postedBy, reports: [] });
    return { data: createdId };
  } catch (error: any) {
    return { error: "Could not create Ad. Please try again" };
  }
}

export async function saveRoommate(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to save ad" };
  }

  const parsedId = parse.data;
  const data = await saveRoommateByUser(parsedId, uid);
  if (!data) return { error: "Failed to save ad" };
  revalidatePath(`/roommate/${id}`);
  return { message: "Ad saved successfully" };
}

export async function reportRoommate(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to update ad" };
  }

  const parsedId = parse.data;
  const data = await reportRoommateById(parsedId, uid);
  if (!data) return { error: "Failed to update ad" };
  revalidatePath(`/roommate/${id}`);
  return { message: "Thank you for your feedback" };
}
