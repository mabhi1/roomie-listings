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

export async function getHouseById(id: string) {
  try {
    const ad = await prisma.houseAd.findUnique({ where: { id } });
    if (!ad) return null;
    return ad;
  } catch (error) {
    return null;
  }
}

export async function saveHouseByUser(id: string, uid: string) {
  try {
    const ad = await prisma.houseAd.findUnique({ where: { id } });
    if (!ad) return null;
    const updatedAd = await prisma.houseAd.update({ where: { id }, data: { savedBy: [...ad.savedBy, uid] } });
    if (!updatedAd) return null;
    return updatedAd;
  } catch (error) {
    return null;
  }
}

export async function reportHouseById(id: string, uid: string) {
  try {
    const ad = await prisma.houseAd.findUnique({ where: { id } });
    if (!ad) return null;
    const reports = !ad.reports ? [] : ad.reports.filter((report) => report !== uid);
    const newAd = await prisma.houseAd.update({ where: { id }, data: { reports: [...reports, uid] } });
    if (!newAd) return null;
    return newAd;
  } catch (error) {
    console.log(error);
    return null;
  }
}
