import { Message } from "@/lib/types";
import prisma from "../prisma";

export async function createMessage(data: Message) {
  try {
    const message = await prisma.message.create({ data });
    if (!message) return null;
    return message;
  } catch (error) {
    console.log(error);
    return null;
  }
}
