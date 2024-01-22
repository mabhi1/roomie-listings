"use server";

import { HouseAd, RoommateAd, User } from "@/lib/types";
import { createMessage } from "@/prisma/db/messages";
import { AdEnquiryTemplate } from "@/resend/emailTemplates/AdEnquiry";
import resend from "@/resend/resend";

export async function sendEmail(
  sender: User,
  receiver: User,
  type: string,
  ad: HouseAd | RoommateAd,
  message: string,
  filename: string | undefined,
  url: string | undefined
) {
  const { data, error } = await resend.emails.send({
    from: "Roommie Listings <no-reply@roomielistings.com>",
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
  return createdMessage;
}
