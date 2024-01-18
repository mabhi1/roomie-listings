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

export async function editRoommateAdById(adId: string, data: RoommateAd) {
  try {
    const roommateAd = await prisma.roommateAd.findUnique({ where: { id: adId } });
    if (!roommateAd) return null;
    const updatedAd = await prisma.roommateAd.update({ where: { id: adId }, data });
    if (!updatedAd) return null;
    return updatedAd.id;
  } catch (error) {
    return null;
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
    if (ad.savedBy.includes(uid)) return ad;
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

export async function getRoommateAdsByUser(uid: string, tab: string) {
  try {
    switch (tab) {
      case "savedAds":
        const ads = await prisma.roommateAd.findMany({ where: { savedBy: { has: uid } } });
        if (!ads) return null;
        return ads;
      case "postedAds":
        const ads1 = await prisma.roommateAd.findMany({ where: { postedBy: uid } });
        if (!ads1) return null;
        return ads1;
      case "reportedAds":
        const ads2 = await prisma.roommateAd.findMany({ where: { reports: { has: uid } } });
        if (!ads2) return null;
        return ads2;
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}

export async function deleteRoommateAdsByUser(uid: string, adId: string, tab: string) {
  try {
    const ad = await prisma.roommateAd.findUnique({ where: { id: adId } });
    if (!ad) return null;

    switch (tab) {
      case "savedAds":
        const savedBy = ad.savedBy ? ad.savedBy.filter((id) => id !== uid) : [];
        const updatedAd = await prisma.roommateAd.update({ where: { id: adId }, data: { savedBy } });
        if (!updatedAd) return null;
        return updatedAd;
      case "postedAds":
        if (!ad.postedBy) return null;
        const deletedComments = await prisma.comment.deleteMany({ where: { postId: adId } });
        if (!deletedComments) return null;
        const deletedAd = await prisma.roommateAd.delete({ where: { id: adId } });
        if (!deletedAd) return null;
        return deletedAd;
      case "reportedAds":
        const reports = ad.reports ? ad.reports.filter((id) => id !== uid) : [];
        const updatedAd1 = await prisma.roommateAd.update({ where: { id: adId }, data: { reports } });
        if (!updatedAd1) return null;
        return updatedAd1;
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}
