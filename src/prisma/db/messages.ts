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

export async function getMessagesByType(userId: string, type: "sent" | "received") {
  try {
    switch (type) {
      case "sent":
        const sentMessages = await prisma.message.findMany({
          where: { sender: userId },
          orderBy: { updatedAt: "desc" },
        });
        if (!sentMessages) return null;
        return sentMessages;
      case "received":
        const receivedMessages = await prisma.message.findMany({
          where: { receiver: userId },
          orderBy: { updatedAt: "desc" },
        });
        if (!receivedMessages) return null;
        return receivedMessages;
    }
  } catch (error) {
    return null;
  }
}
