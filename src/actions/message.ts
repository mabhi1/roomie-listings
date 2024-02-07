"use server";

import { RoomAd, RoommateAd } from "@/lib/types";
import { createMessage } from "@/prisma/db/messages";
import { AdEnquiryTemplate } from "@/resend/emailTemplates/AdEnquiry";
import { ContactTemplate } from "@/resend/emailTemplates/ContactTemplate";
import resend from "@/resend/resend";
import { revalidatePath } from "next/cache";

export async function sendEmail(
  sender: { name: string; email: string; uid: string },
  receiver: { name: string; email: string; uid: string },
  type: string,
  ad: RoomAd | RoommateAd,
  message: string,
  filename: string | undefined,
  url: string | undefined,
) {
  const { data, error } = await resend.emails.send({
    from: "Roomie Listings <no-reply@roomielistings.com>",
    to: [receiver.email],
    reply_to: [sender.email],
    text: message.toString(),
    subject: "New Enquiry for your listings",
    react: AdEnquiryTemplate({
      receiverName: receiver.name,
      senderName: sender.name,
      senderEmail: sender.email,
      message: message.toString(),
      listingTitle: ad.title,
      listingLink: `roomielistings.com/${type}/${ad.id}`,
    }),
    attachments:
      filename && url
        ? [
            {
              filename: filename,
              path: url,
            },
          ]
        : undefined,
  });
  if (error || !data) return null;
  const createdMessage = await createMessage({
    sender: sender.uid,
    receiver: receiver.uid,
    messageId: data.id,
    attachments: url ? [url] : [],
  });
  revalidatePath(`/profile/messages/${sender.uid}`);
  return createdMessage;
}

export async function contactEmail(senderName: string, senderEmail: string, message: string) {
  const { data, error } = await resend.emails.send({
    from: "Roomie Listings <no-reply@roomielistings.com>",
    to: [process.env.ADMIN_EMAIL!],
    reply_to: [senderEmail],
    text: message.toString(),
    subject: "You got a new message",
    react: ContactTemplate({
      senderName: senderName,
      senderEmail: senderEmail,
      message: message.toString(),
    }),
  });

  return { data, error };
}
