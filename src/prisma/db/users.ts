import { User } from "@/lib/types";
import prisma from "../prisma";

export async function createDBUser(data: User) {
  try {
    const user = await prisma.user.create({ data: data });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getUserById(uid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { uid: uid } });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getUserByEmailAndProvider(email: string, provider: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email_provider: { email: email, provider: provider } } });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllDBUsers() {
  try {
    const users = await prisma.user.findMany();
    if (!users) throw new Error("Users not found");
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateProfilePictureByUser(uid: string, url: string | null) {
  try {
    const user = await prisma.user.update({ where: { uid }, data: { photo: url } });
    if (!user) return null;
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateNameByUser(uid: string, name: string) {
  try {
    const user = await prisma.user.update({ where: { uid }, data: { name } });
    if (!user) return null;
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
