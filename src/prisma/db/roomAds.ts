import { RoomAd } from "@/lib/types";
import prisma from "../prisma";

export async function getAllRoomAds() {
  try {
    const rAds = await prisma.roomAd.findMany({ orderBy: { updatedAt: "desc" } });
    if (!rAds) throw new Error("Ads not found");
    return rAds;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createRoomAd(data: RoomAd) {
  try {
    const RoomAd = await prisma.roomAd.create({ data: { ...data, updatedAt: new Date() } });
    if (!RoomAd) throw new Error();
    return RoomAd.id;
  } catch (error) {
    throw new Error();
  }
}

export async function editRoomAdById(adId: string, data: RoomAd) {
  try {
    const RoomAd = await prisma.roomAd.findUnique({ where: { id: adId } });
    if (!RoomAd) return null;
    const updatedAd = await prisma.roomAd.update({ where: { id: adId }, data: { ...data, updatedAt: new Date() } });
    if (!updatedAd) return null;
    return updatedAd.id;
  } catch (error) {
    return null;
  }
}

export async function getRoomById(id: string) {
  try {
    const ad = await prisma.roomAd.findUnique({ where: { id } });
    if (!ad) return null;
    return ad;
  } catch (error) {
    return null;
  }
}

export async function saveRoomByUser(id: string, uid: string) {
  try {
    const ad = await prisma.roomAd.findUnique({ where: { id } });
    if (!ad) return null;
    if (ad.savedBy.includes(uid)) return ad;
    const updatedAd = await prisma.roomAd.update({ where: { id }, data: { savedBy: [...ad.savedBy, uid] } });
    if (!updatedAd) return null;
    return updatedAd;
  } catch (error) {
    return null;
  }
}

export async function reportRoomById(id: string, uid: string) {
  try {
    const ad = await prisma.roomAd.findUnique({ where: { id }, select: { reports: true } });
    if (!ad) return null;
    const reports = ad.reports ? ad.reports.filter(report => report !== uid) : [];
    const newAd = await prisma.roomAd.update({ where: { id }, data: { reports: [...reports, uid] } });
    if (!newAd) return null;
    return newAd;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getRoomAdsByUser(uid: string, tab: string) {
  try {
    switch (tab) {
      case "savedAds":
        const ads = await prisma.roomAd.findMany({ where: { savedBy: { has: uid } }, orderBy: { updatedAt: "desc" } });
        if (!ads) return null;
        return ads;
      case "postedAds":
        const ads1 = await prisma.roomAd.findMany({ where: { postedBy: uid }, orderBy: { updatedAt: "desc" } });
        if (!ads1) return null;
        return ads1;
      case "reportedAds":
        const ads2 = await prisma.roomAd.findMany({
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

export async function deleteRoomAdsByUser(uid: string, adId: string, tab: string) {
  try {
    const ad = await prisma.roomAd.findUnique({ where: { id: adId } });
    if (!ad) return null;

    switch (tab) {
      case "savedAds":
        const savedBy = ad.savedBy ? ad.savedBy.filter(id => id !== uid) : [];
        const updatedAd = await prisma.roomAd.update({ where: { id: adId }, data: { savedBy } });
        if (!updatedAd) return null;
        return updatedAd;
      case "postedAds":
        if (!ad.postedBy) return null;
        const deletedComments = await prisma.comment.deleteMany({ where: { postId: adId } });
        if (!deletedComments) return null;
        const deletedAd = await prisma.roomAd.delete({ where: { id: adId } });
        if (!deletedAd) return null;
        return deletedAd;
      case "reportedAds":
        const reports = ad.reports ? ad.reports.filter(id => id !== uid) : [];
        const updatedAd1 = await prisma.roomAd.update({ where: { id: adId }, data: { reports } });
        if (!updatedAd1) return null;
        return updatedAd1;
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}
