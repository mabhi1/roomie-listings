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

export async function getUser(uid: string) {
  const poster = await getUserById(uid);
  return poster;
}
