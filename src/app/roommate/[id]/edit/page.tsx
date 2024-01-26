import RoommateEditForm from "@/components/forms/RoommateEditForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import Image from "next/image";
import editAdImage from "../../../../../public/edit-ad.webp";

export default async function EditRoommateAd({ params: { id } }: { params: { id: string } }) {
  const roommateAd = await getRoommateById(id);
  if (!roommateAd) throw new Error("Invalid Roommate Ad");
  return (
    <FullWrapper>
      <PageHeader heading="Edit roommate Ad" subHeading="Fill out and submit the form below to edit the ad." />
      <div className="w-full flex justify-between">
        <div className="w-11/12 lg:w-1/2">
          <RoommateEditForm roommateAd={roommateAd} />
        </div>
        <div className="relative h-fit">
          <Image
            src={editAdImage}
            alt="Edit Ad"
            width={1003}
            height={1200}
            className="h-auto w-[501px]"
            priority
            placeholder="blur"
          />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
