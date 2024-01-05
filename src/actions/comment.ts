"use server";

import { createComment, deleteCommentById, likeCommentById, reportCommentById } from "@/prisma/db/comments";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addComment(comment: FormDataEntryValue, uid: string, postId: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(comment);

  if (!parse.success) {
    return { error: "Failed to add comment" };
  }

  const parsedComment = parse.data;

  const data = await createComment({ comment: parsedComment, uid, postId, likes: [], reports: [] });
  if (!data) return { error: "Failed to add comment" };
  revalidatePath(`/roommate/${postId}`);
  return { message: "Comment added successfully" };
}

export async function deleteComment(commentId: string, adId: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(commentId);

  if (!parse.success) {
    return { error: "Failed to delete comment" };
  }

  const parsedComment = parse.data;

  const data = await deleteCommentById(parsedComment);
  if (!data) return { error: "Failed to delete comment" };
  revalidatePath(`/roommate/${adId}`);
  return { message: "Comment deleted successfully" };
}

export async function likeComment(commentId: string, uid: string, adId: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(commentId);

  if (!parse.success) {
    return { error: "Failed to update comment" };
  }

  const parsedComment = parse.data;
  const data = await likeCommentById(parsedComment, uid);
  if (!data) return { error: "Failed to update comment" };
  revalidatePath(`/roommate/${adId}`);
  return { message: "Thank you for your feedback" };
}

export async function reportComment(commentId: string, uid: string, adId: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(commentId);

  if (!parse.success) {
    return { error: "Failed to update comment" };
  }

  const parsedComment = parse.data;
  const data = await reportCommentById(parsedComment, uid);
  if (!data) return { error: "Failed to update comment" };
  revalidatePath(`/roommate/${adId}`);
  return { message: "Thank you for your feedback" };
}
