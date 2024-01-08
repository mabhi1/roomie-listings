import { Comment } from "@/lib/types";
import prisma from "../prisma";

export async function getAllCommentsByAd(id: string) {
  try {
    const comments = await prisma.comment.findMany({ where: { postId: id } });
    if (!comments) return [];
    return comments;
  } catch (error) {
    return [];
  }
}

export async function createComment(data: Comment) {
  try {
    const comment = await prisma.comment.create({ data });
    if (!comment) return null;
    return comment;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteCommentById(id: string) {
  try {
    const comment = await prisma.comment.delete({ where: { id } });
    if (!comment) return null;
    return comment;
  } catch (error) {
    return null;
  }
}

export async function likeCommentById(id: string, uid: string) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return null;
    const likes = comment.likes.filter((like) => like !== uid);
    const newComment = await prisma.comment.update({ where: { id }, data: { likes: [...likes, uid] } });
    if (!comment) return null;
    return newComment;
  } catch (error) {
    return null;
  }
}

export async function reportCommentById(id: string, uid: string) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return null;
    const reports = !comment.reports ? [] : comment.reports.filter((report) => report !== uid);
    const newComment = await prisma.comment.update({ where: { id }, data: { reports: [...reports, uid] } });
    if (!comment) return null;
    return newComment;
  } catch (error) {
    return null;
  }
}

export async function getAllCommentsByUser(uid: string, tab: string) {
  try {
    switch (tab) {
      case "comments":
        const comments = await prisma.comment.findMany({ where: { uid } });
        if (!comments) return null;
        return comments;
      case "reportedComments":
        const reportedComments = await prisma.comment.findMany({ where: { reports: { has: uid } } });
        if (!reportedComments) return null;
        return reportedComments;
      default:
        return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteReportedCommentByUser(commentId: string, uid: string) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return null;
    const reports = comment.reports ? comment.reports.filter((id) => id !== uid) : [];
    const reportedComments = await prisma.comment.update({ where: { id: commentId }, data: { reports } });
    if (!reportedComments) return null;
    return reportedComments;
  } catch (error) {
    console.log(error);
    return null;
  }
}
