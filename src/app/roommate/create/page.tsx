import RoommateAdForm from "@/components/forms/RoommateAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";
import roomAdImage from "../../../../public/ad-image.webp";

export default function CreateRoommateAd() {
  return (
    <FullWrapper>
      <PageHeader heading="Become a roommate" subHeading="Fill out and submit the form below create a roommate ad." />
      <div className="flex w-full justify-between">
        <div className="md:w-11/12 lg:w-1/2">
          <RoommateAdForm />
        </div>
        <div className="relative hidden md:block">
          <Image
            src={roomAdImage}
            alt="List a roommate"
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
