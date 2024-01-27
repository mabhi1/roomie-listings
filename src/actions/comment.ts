"use server";

import {
  createComment,
  deleteCommentById,
  deleteReportedCommentByUser,
  getAllCommentsByUser,
  likeCommentById,
  reportCommentById,
} from "@/prisma/db/comments";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addComment(
  comment: FormDataEntryValue,
  uid: string,
  postId: string,
  postType: "house" | "roommate",
) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(comment);

  if (!parse.success) {
    return { error: "Failed to add comment" };
  }

  const parsedComment = parse.data;

  const data = await createComment({ comment: parsedComment, uid, postId, likes: [], reports: [], postType });
  if (!data) return { error: "Failed to add comment" };
  revalidatePath(`/${postType}/${postId}`);
  return { message: "Comment added successfully" };
}

export async function deleteComment(commentId: string, postId: string, postType: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(commentId);

  if (!parse.success) {
    return { error: "Failed to delete comment" };
  }

  const parsedComment = parse.data;

  const data = await deleteCommentById(parsedComment);
  if (!data) return { error: "Failed to delete comment" };
  revalidatePath(`/${postType}/${postId}`);
  return { message: "Comment deleted successfully" };
}

export async function likeComment(commentId: string, uid: string, postId: string, postType: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(commentId);

  if (!parse.success) {
    return { error: "Failed to update comment" };
  }

  const parsedComment = parse.data;
  const data = await likeCommentById(parsedComment, uid);
  if (!data) return { error: "Failed to update comment" };
  revalidatePath(`/${postType}/${postId}`);
  return { message: "Thank you for your feedback" };
}

export async function reportComment(commentId: string, uid: string, postId: string, postType: string) {
  const schema = z.string().min(1);
  const parse = schema.safeParse(commentId);

  if (!parse.success) {
    return { error: "Failed to update comment" };
  }

  const parsedComment = parse.data;
  const data = await reportCommentById(parsedComment, uid);
  if (!data) return { error: "Failed to update comment" };
  revalidatePath(`/${postType}/${postId}`);
  return { message: "Thank you for your feedback" };
}

export async function getAllComments(uid: string, tab: string) {
  const comments = await getAllCommentsByUser(uid, tab);
  return comments;
}

export async function deleteReportedComment(commentId: string, uid: string, postId: string, postType: string) {
  const comments = await deleteReportedCommentByUser(commentId, uid);
  revalidatePath(`/${postType}/${postId}`);
  return comments;
}
