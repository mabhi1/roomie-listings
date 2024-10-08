import RoommateEditForm from "@/components/forms/RoommateEditForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import Image from "next/image";
import editAdImage from "../../../../../public/edit-ad.webp";
import { ScanEyeIcon } from "lucide-react";
import { RoommateAd } from "@/lib/types";

export default async function EditRoommateAd({ params: { id } }: { params: { id: string } }) {
  const roommateAd = (await getRoommateById(id)) as RoommateAd;
  if (!roommateAd) throw new Error("Roommate ad not found");
  return (
    <FullWrapper>
      <PageHeader
        heading="Edit roommate Ad"
        subHeading="Fill out and submit the form below to edit the ad."
        action={{ text: "view this ad", icon: <ScanEyeIcon className="mr-1 w-4" />, link: `/roommate/${id}` }}
      />
      <div className="flex w-full justify-between gap-10">
        <div className="md:w-11/12 lg:w-2/3">
          <RoommateEditForm roommateAd={roommateAd} />
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
