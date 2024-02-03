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

  const {
    acceptTc,
    stay,
    accomodates,
    attachedBath,
    gender,
    rentType,
    furnished,
    amenities,
    vegetarian,
    smoking,
    petFriendly,
    ...dbData
  } = values;
  const roomRequirements = {
    stay,
    accomodates,
    attachedBath,
    gender,
    rentType,
    furnished,
    amenities,
    vegetarian,
    smoking,
    petFriendly,
  };
  try {
    const createdId = await createRoomAd({ roomRequirements, ...dbData, savedBy, postedBy, reports: [], gallery });
    revalidatePath("/room");
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

  const {
    acceptTc,
    stay,
    accomodates,
    attachedBath,
    gender,
    rentType,
    furnished,
    amenities,
    vegetarian,
    smoking,
    petFriendly,
    ...dbData
  } = values;
  const roomRequirements = {
    stay,
    accomodates,
    attachedBath,
    gender,
    rentType,
    furnished,
    amenities,
    vegetarian,
    smoking,
    petFriendly,
  };
  try {
    const updatedId = await editRoomAdById(adId, { roomRequirements, ...dbData, savedBy, postedBy, reports, gallery });
    revalidatePath("/room");
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
  if (!data) return null;
  revalidatePath(`/room/${id}`);
  return data;
}

export async function reportRoom(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to update ad" };
  }

  const parsedId = parse.data;
  const data = await reportRoomById(parsedId, uid);
  if (!data) return null;
  revalidatePath(`/room/${id}`);
  return data;
}

export async function getRoomAds(uid: string, tab: string) {
  const roomAd = await getRoomAdsByUser(uid, tab);
  return roomAd;
}

export async function deleteRoomAds(uid: string, adId: string, tab: string) {
  const roomAd = await deleteRoomAdsByUser(uid, adId, tab);
  revalidatePath(`/room/${adId}`);
  return roomAd;
}
