"use server";

import * as z from "zod";
import { HouseAdSchema } from "@/schema";
import {
  createHouseAd,
  deleteHouseAdsByUser,
  editHouseAdById,
  getHouseAdsByUser,
  reportHouseById,
  saveHouseByUser,
} from "@/prisma/db/houseAds";
import { revalidatePath } from "next/cache";
import { Gallery } from "@prisma/client";

export async function createHouse(
  values: z.infer<typeof HouseAdSchema>,
  savedBy: string[],
  postedBy: string,
  gallery: Gallery[],
) {
  const validatedFields = HouseAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const createdId = await createHouseAd({ ...dbData, savedBy, postedBy, reports: [], gallery });
    revalidatePath("/house");
    return { data: createdId };
  } catch (error: any) {
    return { error: "Could not create Ad. Please try again later" };
  }
}

export async function editHouse(
  adId: string,
  values: z.infer<typeof HouseAdSchema>,
  savedBy: string[],
  postedBy: string,
  reports: string[],
  gallery: Gallery[],
) {
  const validatedFields = HouseAdSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid fields!" };

  const { acceptTc, ...dbData } = values;
  try {
    const updatedId = await editHouseAdById(adId, { ...dbData, savedBy, postedBy, reports, gallery });
    revalidatePath("/house");
    return { data: updatedId };
  } catch (error: any) {
    return { error: "Could not update Ad. Please try again later" };
  }
}

export async function savehouse(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to save ad" };
  }

  const parsedId = parse.data;
  const data = await saveHouseByUser(parsedId, uid);
  if (!data) return { error: "Failed to save ad" };
  revalidatePath(`/house/${id}`);
  return { message: "Ad saved successfully" };
}

export async function reporthouse(id: string, uid: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(id);

  if (!parse.success) {
    return { error: "Failed to update ad" };
  }

  const parsedId = parse.data;
  const data = await reportHouseById(parsedId, uid);
  if (!data) return { error: "Failed to update ad" };
  revalidatePath(`/house/${id}`);
  return { message: "Thank you for your feedback" };
}

export async function getHouseAds(uid: string, tab: string) {
  const houseAds = await getHouseAdsByUser(uid, tab);
  return houseAds;
}

export async function deleteHouseAds(uid: string, adId: string, tab: string) {
  const houseAds = await deleteHouseAdsByUser(uid, adId, tab);
  revalidatePath(`/house/${adId}`);
  return houseAds;
}
