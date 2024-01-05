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
    console.log(error);
    return null;
  }
}
