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

export async function getRoommateById(id: string) {
  try {
    const houseAd = await prisma.roommateAd.findUnique({ where: { id } });
    if (!houseAd) return null;
    return houseAd;
  } catch (error) {
    return null;
  }
}
