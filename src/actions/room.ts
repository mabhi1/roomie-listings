"use server";

import * as z from "zod";
import { RoomAdSchema } from "@/schema";
import {
  createRoomAd,
  deleteRoomAdsByUser,
  editRoomAdById,
  getRoomAdsByUser,
  reportRoomById,
  saveRoomByUser,
} from "@/prisma/db/roomAds";
import { revalidatePath } from "next/cache";
import { Gallery } from "@prisma/client";

export async function createRoom(
  values: z.infer<typeof RoomAdSchema>,
  savedBy: string[],
  postedBy: string,
  gallery: Gallery[],
) {
  const validatedFields = RoomAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const createdId = await createRoomAd({ ...dbData, savedBy, postedBy, reports: [], gallery });
    revalidatePath("/Room");
    return { data: createdId };
  } catch (error: any) {
    return { error: "Could not create Ad. Please try again later" };
  }
}

export async function editRoom(
  adId: string,
  values: z.infer<typeof RoomAdSchema>,
  savedBy: string[],
  postedBy: string,
  reports: string[],
  gallery: Gallery[],
) {
  const validatedFields = RoomAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const updatedId = await editRoomAdById(adId, { ...dbData, savedBy, postedBy, reports, gallery });
    revalidatePath("/Room");
    return { data: updatedId };
  } catch (error: any) {
    return { error: "Could not update Ad. Please try again later" };
  }
}

export async function saveRoom(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to save ad" };
  }

  const parsedId = parse.data;
  const data = await saveRoomByUser(parsedId, uid);
  if (!data) return { error: "Failed to save ad" };
  revalidatePath(`/Room/${id}`);
  return { message: "Ad saved successfully" };
}

export async function reportRoom(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to update ad" };
  }

  const parsedId = parse.data;
  const data = await reportRoomById(parsedId, uid);
  if (!data) return { error: "Failed to update ad" };
  revalidatePath(`/Room/${id}`);
  return { message: "Thank you for your feedback" };
}

export async function getRoomAds(uid: string, tab: string) {
  const RoomAds = await getRoomAdsByUser(uid, tab);
  return RoomAds;
}

export async function deleteRoomAds(uid: string, adId: string, tab: string) {
  const RoomAds = await deleteRoomAdsByUser(uid, adId, tab);
  revalidatePath(`/Room/${adId}`);
  return RoomAds;
}
