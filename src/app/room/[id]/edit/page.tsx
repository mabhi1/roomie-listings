import RoomEditForm from "@/components/forms/RoomEditForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getRoomById } from "@/prisma/db/roomAds";
import Image from "next/image";
import editAdImage from "../../../../../public/edit-ad.webp";
import { RoomAd } from "@/lib/types";
import { ScanEyeIcon } from "lucide-react";

export default async function EditRoomAd({ params: { id } }: { params: { id: string } }) {
  const roomAd = (await getRoomById(id)) as RoomAd;
  if (!roomAd) throw new Error("Room ad not found");
  return (
    <FullWrapper>
      <PageHeader
        heading="Edit Rental Ad"
        subHeading="Fill out and submit the form below to edit the ad."
        action={{ text: "view this ad", icon: <ScanEyeIcon className="mr-1 w-4" />, link: `/room/${id}` }}
      />
      <div className="flex w-full justify-between gap-10">
        <div className="md:w-11/12 lg:w-2/3">
          <RoomEditForm roomAd={roomAd} />
        </div>
        <div className="relative hidden h-fit md:block">
          <Image
            src={editAdImage}
            alt="Edit Ad"
            width={1003}
            height={1200}
            className="h-auto w-[501px]"
            priority
            placeholder="blur"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-white/30"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
