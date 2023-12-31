import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getAllRoommateAds } from "@/prisma/db/roommaateAds";
import DataTable from "@/components/ui/data-table";
import { Columns } from "@/components/tables/roommate/Columns";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LandmarkIcon } from "lucide-react";

export default async function Roommate() {
  const roommateData = await getAllRoommateAds();

  return (
    <FullWrapper>
      <PageHeader heading="Roommate Ads" />
      <div className="relative flex gap-5">
        <div className="flex-1">
          <DataTable columns={Columns} data={roommateData} />
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/5 flex flex-col gap-2 sticky top-20 h-60">
          <Image alt="Roommate" src="/roommate.webp" width={250} height={95} priority />
          <h2 className="text-xl">Looking for a roommate?</h2>
          <p className="text-muted-foreground">
            Are you looking for a roommate and couldn&apos;t find one? Click the button below to list your house.
          </p>
          <Link href="#" legacyBehavior passHref>
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
