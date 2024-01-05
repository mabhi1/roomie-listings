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
    const ad = await prisma.roommateAd.create({ data });
    if (!ad) throw new Error();
    return ad.id;
  } catch (error) {
    throw new Error();
  }
}

export async function getRoommateById(id: string) {
  try {
    const ad = await prisma.roommateAd.findUnique({ where: { id } });
    if (!ad) return null;
    return ad;
  } catch (error) {
    return null;
  }
}

export async function saveRoommateByUser(id: string, uid: string) {
  try {
    const ad = await prisma.roommateAd.findUnique({ where: { id } });
    if (!ad) return null;
    const updatedAd = await prisma.roommateAd.update({ where: { id }, data: { savedBy: [...ad.savedBy, uid] } });
    if (!updatedAd) return null;
    return updatedAd;
  } catch (error) {
    return null;
  }
}

export async function reportRoommateById(id: string, uid: string) {
  try {
    const ad = await prisma.roommateAd.findUnique({ where: { id } });
    if (!ad) return null;
    const reports = !ad.reports ? [] : ad.reports.filter((report) => report !== uid);
    const newAd = await prisma.roommateAd.update({ where: { id }, data: { reports: [...reports, uid] } });
    if (!newAd) return null;
    return newAd;
  } catch (error) {
    console.log(error);
    return null;
  }
}
