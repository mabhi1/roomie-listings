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
