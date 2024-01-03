import RoommateAdForm from "@/components/forms/RoommateAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";

export default function CreateRoommateAd() {
  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="Become a roommate" />
      <div className="w-full relative">
        <div className="w-1/2">
          <RoommateAdForm />
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
