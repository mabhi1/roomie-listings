import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import DataTable from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TagsIcon } from "lucide-react";
import { getAllHouseAds } from "@/prisma/db/houseAds";
import { HouseColumns } from "@/components/tables/house/Columns";

export default async function House() {
  const houseData = await getAllHouseAds();
  return (
    <FullWrapper>
      <PageHeader
        heading="House Ads"
        subHeading="Browse throught the list of house ads and find the perfect place to stay."
      />
      <div className="relative flex gap-5">
        <div className="flex-1">
          <DataTable columns={HouseColumns} data={houseData} page="house" />
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/5 flex flex-col gap-2 sticky top-20 h-60">
          <Image alt="House" src="/house.png" width={250} height={95} priority className="w-auto" />
          <h2 className="text-xl">Looking for a house?</h2>
          <p className="text-muted-foreground">
            Are you looking for a house and couldn&apos;t find one? Click the button below to post an Ad in roommates
            and let others find you.
          </p>
          <Link href="/roommate/create" legacyBehavior passHref>
            <Button className="mt-2">
              <TagsIcon className="w-4 mr-1" />
              Post Ad
            </Button>
          </Link>
        </div>
      </div>
    </FullWrapper>
  );
}
