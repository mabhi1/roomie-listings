import MessageForm from "@/components/forms/MessageForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getRoomById } from "@/prisma/db/roomAds";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import sendEmailImage from "../../../../public/send-email.png";
import { RoomAd, RoommateAd } from "@/lib/types";
import IndividualAd from "@/components/page/IndividualAd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Message",
};

export default async function SendMessage({ params: { messageProps } }: { params: { messageProps: string[] } }) {
  if (messageProps.length !== 4) throw new Error("Invalid Request");
  const sender = await getUserById(messageProps[0]);
  if (!sender) throw new Error("Invalid Request");
  const receiver = await getUserById(messageProps[1]);
  if (!receiver) throw new Error("Invalid Request");
  const type = messageProps[2];
  if (!["room", "roommate"].includes(type)) throw new Error("Invalid Request");
  const ad =
    type === "room"
      ? ((await getRoomById(messageProps[3])) as RoomAd)
      : ((await getRoommateById(messageProps[3])) as RoommateAd);
  if (!ad) throw new Error("Invalid Request");

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Send Message"
        subHeading="Submit the form below to send an enquiry email. Following details will be sent along with your message"
      />
      <IndividualAd ad={ad} />
      <div className="flex w-full justify-between gap-10">
        <div className="w-full space-y-5 md:w-1/2">
          <MessageForm sender={sender} receiver={receiver} type={type} ad={ad} />
        </div>
        <div className="relative hidden w-1/2 pt-10 md:block">
          <Image
            src={sendEmailImage}
            alt="Send an email"
            width={1003}
            height={900}
            className="h-auto w-auto"
            priority
            placeholder="blur"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-white/30"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
