import { RoommateAd } from "@/lib/types";
import prisma from "../prisma";

export async function getAllRoommateAds() {
  try {
    const rAds = await prisma.roommateAd.findMany();
    if (!rAds) throw new Error("Ads not found");
    return rAds;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createRoommateAd(data: RoommateAd) {
  try {
    const houseAd = await prisma.roommateAd.create({ data });
    if (!houseAd) throw new Error();
    return houseAd.id;
  } catch (error) {
    throw new Error();
  }
}
