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

export default async function Roommate() {
  const roommateData = await getAllRoommateAds();
  return (
    <FullWrapper className="gap-5">
      <PageHeader
        heading="Roommate Ads"
        subHeading="Browse throught the list of roommate ads and find the perfect partner you want to stay with."
      />
      <div className="relative flex flex-col xl:flex-row gap-5">
        <div className="flex-1">
          <DataTable columns={RoommateColumns} data={roommateData} page="roommate" />
        </div>
        <Separator orientation="vertical" className="hidden lg:block" />
        <div className="w-1/3 xl:w-1/5 flex flex-col gap-2 sticky top-20 h-60">
          <Image alt="Roommate" src="/roommate.webp" width={250} height={95} priority className="w-auto" />
          <h2 className="text-xl">Looking for a roommate?</h2>
          <p className="text-muted-foreground">
            Are you looking for a roommate and couldn&apos;t find one? Click the button below to list your house and let
            others find you.
          </p>
          <Link href="/house/create" legacyBehavior passHref>
            <Button className="mt-2">
              <LandmarkIcon className="w-4 mr-1" />
              List your house
            </Button>
          </Link>
        </div>
      </div>
    </FullWrapper>
  );
}
