import HouseEditForm from "@/components/forms/HouseEditForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getHouseById } from "@/prisma/db/houseAds";
import Image from "next/image";
import editAdImage from "../../../../../public/edit-ad.webp";

export default async function EditHouseAd({ params: { id } }: { params: { id: string } }) {
  const houseAd = await getHouseById(id);
  if (!houseAd) throw new Error("Invalid House Ad");
  return (
    <FullWrapper>
      <PageHeader heading="Edit house Ad" subHeading="Fill out and submit the form below to edit the ad." />
      <div className="w-full flex justify-between">
        <div className="w-11/12 lg:w-1/2">
          <HouseEditForm houseAd={houseAd} />
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
