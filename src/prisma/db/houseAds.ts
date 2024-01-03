import { HouseAd } from "@/lib/types";
import prisma from "../prisma";

export async function getAllHouseAds() {
  try {
    const rAds = await prisma.houseAd.findMany();
    if (!rAds) throw new Error("Ads not found");
    return rAds;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createHouseAd(data: HouseAd) {
  try {
    const houseAd = await prisma.houseAd.create({ data });
    if (!houseAd) throw new Error();
    return houseAd.id;
  } catch (error) {
    throw new Error();
  }
}
