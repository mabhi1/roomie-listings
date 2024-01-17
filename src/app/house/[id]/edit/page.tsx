import HouseEditForm from "@/components/forms/HouseEditForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getHouseById } from "@/prisma/db/houseAds";
import Image from "next/image";

export default async function EditHouseAd({ params: { id } }: { params: { id: string } }) {
  const houseAd = await getHouseById(id);
  if (!houseAd) throw new Error("Invalid House Ad");
  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="Edit house Ad" />
      <div className="w-full flex justify-between">
        <div className="w-1/2">
          <HouseEditForm houseAd={houseAd} />
        </div>
        <div className="relative h-fit">
          <Image src="/edit-ad.webp" alt="Edit Ad" width={1003} height={1200} className="h-auto w-[501px]" priority />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
