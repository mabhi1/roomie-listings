"use server";

import { getUserById, updateNameByUser, updateProfilePictureByUser } from "@/prisma/db/users";
import { revalidatePath } from "next/cache";

export async function updateProfilePicture(uid: string, url: string | null) {
  const user = await updateProfilePictureByUser(uid, url);
  revalidatePath("/profile");
  return user;
}

export async function updateUserName(uid: string, name: string) {
  const user = await updateNameByUser(uid, name);
  revalidatePath("/profile");
  return user;
}

export async function getPosterById(posterId: string) {
  const poster = await getUserById(posterId);
  return poster;
}
