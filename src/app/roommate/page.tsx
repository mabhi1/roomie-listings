import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { PlusSquareIcon } from "lucide-react";
import AdsList from "@/components/page/AdsList";
import { RoommateAd } from "@/lib/types";
import { Metadata } from "next";
import { getAllRoommateAds } from "@/prisma/db/roommaateAds";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roommate Ads",
};

export default async function Room() {
  const roommateData = (await getAllRoommateAds()) as RoommateAd[];

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Roommate Ads"
        subHeading="Browse throught the list of roommate ads and find the perfect partner to stay with."
        action={{
          link: "/roommate/create",
          text: "create a roommate ad",
          icon: <PlusSquareIcon className="mr-1 w-4" />,
        }}
      />
      <AdsList ads={roommateData} page="roommate" />
    </FullWrapper>
  );
}
