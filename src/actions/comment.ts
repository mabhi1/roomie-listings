"use server";

import { createComment, deleteCommentById } from "@/prisma/db/comments";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addComment(comment: FormDataEntryValue, uid: string, postId: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(comment);

  if (!parse.success) {
    return { error: "Failed to add comment" };
  }

  const parsedComment = parse.data;

  const data = await createComment({ comment: parsedComment, uid, postId });
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
