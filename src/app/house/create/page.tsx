import HouseAdForm from "@/components/forms/HousAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";

export default function CreateHouseAd() {
  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="List a house" />
      <div className="w-full flex justify-between">
        <div className="w-1/2">
          <HouseAdForm />
        </div>
        <div className="relative">
          <Image
            src="/house-ad.webp"
            alt="List a house"
            width={1003}
            height={1200}
            className="h-auto w-auto"
            priority
          />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
