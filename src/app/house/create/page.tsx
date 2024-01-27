import HouseAdForm from "@/components/forms/HousAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";
import houseAdImage from "../../../../public/house-ad.webp";

export default function CreateHouseAd() {
  return (
    <FullWrapper>
      <PageHeader heading="List a house" subHeading="Fill out and submit the form below create a house ad." />
      <div className="flex w-full justify-between">
        <div className="md:w-11/12 lg:w-1/2">
          <HouseAdForm />
        </div>
        <div className="relative hidden md:block">
          <Image
            src={houseAdImage}
            alt="List a house"
            width={1003}
            height={1200}
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
