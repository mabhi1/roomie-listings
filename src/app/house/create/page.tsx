import HouseAdForm from "@/components/forms/HousAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";

export default function CreateHouseAd() {
  return (
    <FullWrapper>
      <PageHeader heading="List a house" subHeading="Fill out and submit the form below create a house ad." />
      <div className="w-full flex justify-between">
        <div className="md:w-11/12 lg:w-1/2">
          <HouseAdForm />
        </div>
        <div className="relative hidden md:block">
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
