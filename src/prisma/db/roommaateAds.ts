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
