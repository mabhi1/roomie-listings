import RoomAdForm from "@/components/forms/RoomAdForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";
import roomAdImage from "../../../../public/ad-image.webp";
import { SearchIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a rental ad",
};

export default function CreateRoomAd() {
  return (
    <FullWrapper>
      <PageHeader
        heading="Create a rental ad"
        subHeading="Fill out and submit the form below to post your needs."
        action={{ text: "browse rental ads", link: "/room", icon: <SearchIcon className="mr-1 w-4" /> }}
      />
      <div className="flex w-full justify-between gap-10">
        <div className="md:w-11/12 lg:w-2/3">
          <RoomAdForm />
        </div>
        <div className="relative mt-10 hidden md:block">
          <Image
            src={roomAdImage}
            alt="List a room"
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
