import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getAllRoommateAds } from "@/prisma/db/roommaateAds";
import DataTable from "@/components/ui/data-table";
import { RoommateColumns } from "@/components/tables/roommate/Columns";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LandmarkIcon } from "lucide-react";
import roommateImage from "../../../public/roommate.webp";

export default async function Roommate() {
  const roommateData = await getAllRoommateAds();
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Roommate Ads"
        subHeading="Browse throught the list of roommate ads and find the perfect partner you want to stay with."
      />
      <div className="relative flex flex-col gap-5 xl:flex-row">
        <div className="flex-1">
          <DataTable columns={RoommateColumns} data={roommateData} page="roommate" />
        </div>
        <Separator orientation="vertical" className="hidden lg:block" />
        <div className="sticky top-20 flex h-60 flex-col gap-2 md:w-1/3 xl:w-1/5">
          <Image
            alt="Roommate"
            src={roommateImage}
            width={250}
            height={95}
            priority
            className="w-auto"
            placeholder="blur"
          />
          <h2 className="text-xl">Looking for a roommate?</h2>
          <p className="text-muted-foreground">
            Are you looking for a roommate and couldn&apos;t find one? Click the button below to list your house and let
            others find you.
          </p>
          <Link href="/house/create" legacyBehavior passHref>
            <Button className="mt-2">
              <LandmarkIcon className="mr-1 w-4" />
              List your house
            </Button>
          </Link>
        </div>
      </div>
    </FullWrapper>
  );
}
