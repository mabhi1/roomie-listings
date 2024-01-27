import { HouseAd } from "@/lib/types";
import prisma from "../prisma";

export async function getAllHouseAds() {
  try {
    const rAds = await prisma.houseAd.findMany({ orderBy: { updatedAt: "desc" } });
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

export async function editHouseAdById(adId: string, data: HouseAd) {
  try {
    const houseAd = await prisma.houseAd.findUnique({ where: { id: adId } });
    if (!houseAd) return null;
    const updatedAd = await prisma.houseAd.update({ where: { id: adId }, data });
    if (!updatedAd) return null;
    return updatedAd.id;
  } catch (error) {
    return null;
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
    if (ad.savedBy.includes(uid)) return ad;
    const updatedAd = await prisma.houseAd.update({ where: { id }, data: { savedBy: [...ad.savedBy, uid] } });
    if (!updatedAd) return null;
    return updatedAd;
  } catch (error) {
    return null;
  }
}

export async function reportHouseById(id: string, uid: string) {
  try {
    const ad = await prisma.houseAd.findUnique({ where: { id }, select: { reports: true } });
    if (!ad) return null;
    const reports = ad.reports ? ad.reports.filter(report => report !== uid) : [];
    const newAd = await prisma.houseAd.update({ where: { id }, data: { reports: [...reports, uid] } });
    if (!newAd) return null;
    return newAd;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getHouseAdsByUser(uid: string, tab: string) {
  try {
    switch (tab) {
      case "savedAds":
        const ads = await prisma.houseAd.findMany({ where: { savedBy: { has: uid } }, orderBy: { updatedAt: "desc" } });
        if (!ads) return null;
        return ads;
      case "postedAds":
        const ads1 = await prisma.houseAd.findMany({ where: { postedBy: uid }, orderBy: { updatedAt: "desc" } });
        if (!ads1) return null;
        return ads1;
      case "reportedAds":
        const ads2 = await prisma.houseAd.findMany({
          where: { reports: { has: uid } },
          orderBy: { updatedAt: "desc" },
        });
        if (!ads2) return null;
        return ads2;
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}

export async function deleteHouseAdsByUser(uid: string, adId: string, tab: string) {
  try {
    const ad = await prisma.houseAd.findUnique({ where: { id: adId } });
    if (!ad) return null;

    switch (tab) {
      case "savedAds":
        const savedBy = ad.savedBy ? ad.savedBy.filter(id => id !== uid) : [];
        const updatedAd = await prisma.houseAd.update({ where: { id: adId }, data: { savedBy } });
        if (!updatedAd) return null;
        return updatedAd;
      case "postedAds":
        if (!ad.postedBy) return null;
        const deletedComments = await prisma.comment.deleteMany({ where: { postId: adId } });
        if (!deletedComments) return null;
        const deletedAd = await prisma.houseAd.delete({ where: { id: adId } });
        if (!deletedAd) return null;
        return deletedAd;
      case "reportedAds":
        const reports = ad.reports ? ad.reports.filter(id => id !== uid) : [];
        const updatedAd1 = await prisma.houseAd.update({ where: { id: adId }, data: { reports } });
        if (!updatedAd1) return null;
        return updatedAd1;
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}
