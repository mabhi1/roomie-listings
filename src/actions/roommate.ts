"use server";

import * as z from "zod";
import { RoommateAdSchema } from "@/schema";
import {
  createRoommateAd,
  deleteRoommateAdsByUser,
  editRoommateAdById,
  getRoommateAdsByUser,
  reportRoommateById,
  saveRoommateByUser,
} from "@/prisma/db/roommaateAds";
import { revalidatePath } from "next/cache";

export async function createRoommate(values: z.infer<typeof RoommateAdSchema>, savedBy: string[], postedBy: string) {
  const validatedFields = RoommateAdSchema.safeParse(values);

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
    const createdId = await createRoommateAd({ roomRequirements, ...dbData, savedBy, postedBy, reports: [] });
    revalidatePath("/roommate");
    return { data: createdId };
  } catch (error: any) {
    return { error: "Could not create Ad. Please try again later" };
  }
}

export async function editRoommate(
  adId: string,
  values: z.infer<typeof RoommateAdSchema>,
  savedBy: string[],
  postedBy: string,
  reports: string[],
) {
  const validatedFields = RoommateAdSchema.safeParse(values);

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
    const updatedId = await editRoommateAdById(adId, { roomRequirements, ...dbData, savedBy, postedBy, reports });
    revalidatePath("/roommate");
    return { data: updatedId };
  } catch (error: any) {
    return { error: "Could not update Ad. Please try again later" };
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
  if (!data) return null;
  revalidatePath(`/roommate/${id}`);
  return data;
}

export async function reportRoommate(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to update ad" };
  }

  const parsedId = parse.data;
  const data = await reportRoommateById(parsedId, uid);
  if (!data) return null;
  revalidatePath(`/roommate/${id}`);
  return data;
}

export async function getRoommateAds(uid: string, tab: string) {
  const roommaateAds = await getRoommateAdsByUser(uid, tab);
  return roommaateAds;
}

export async function deleteRoommateAds(uid: string, adId: string, tab: string) {
  const roommateAds = await deleteRoommateAdsByUser(uid, adId, tab);
  revalidatePath(`/roommate/${adId}`);
  return roommateAds;
}
