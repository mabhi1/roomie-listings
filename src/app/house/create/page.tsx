import HouseAdForm from "@/components/forms/HousAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";

export default function CreateHouseAd() {
  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="List a house" />
      <div className="w-full relative">
        <div className="w-1/2">
          <HouseAdForm />
        </div>
        <Image
          src="/house-ad.webp"
          alt="List a house"
          width={1003}
          height={1200}
          className="absolute right-20 top-0 -z-10 w-auto"
          priority
        />
      </div>
    </FullWrapper>
  );
}
