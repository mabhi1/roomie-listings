import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { PlusSquareIcon } from "lucide-react";
import { getAllRoomAds } from "@/prisma/db/roomAds";
import AdsList from "@/components/page/AdsList";
import { RoomAd } from "@/lib/types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rental Ads",
};

export default async function Room() {
  const roomData = (await getAllRoomAds()) as RoomAd[];

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Rental Ads"
        subHeading="Browse throught the list of room ads and find the perfect place to stay."
        action={{ link: "/room/create", text: "create a rental ad", icon: <PlusSquareIcon className="mr-1 w-4" /> }}
      />
      <AdsList ads={roomData} page="rental" />
    </FullWrapper>
  );
}
