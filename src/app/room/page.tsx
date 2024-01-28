import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import DataTable from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TagsIcon } from "lucide-react";
import { getAllRoomAds } from "@/prisma/db/roomAds";
import { RoomColumns } from "@/components/tables/room/Columns";
import roomImage from "../../../public/room.png";

export const dynamic = "force-dynamic";

export default async function Room() {
  const roomData = await getAllRoomAds();
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Room Ads"
        subHeading="Browse throught the list of room ads and find the perfect place to stay."
      />
      <div className="relative flex flex-col gap-5 xl:flex-row">
        <div className="flex-1">
          <DataTable columns={RoomColumns} data={roomData} page="room" />
        </div>
        <Separator orientation="vertical" className="hidden lg:block" />
        <div className="top-20 flex h-60 flex-col gap-2 md:w-1/3 xl:sticky xl:w-1/6">
          <Image alt="Room" src={roomImage} width={250} height={95} priority className="w-auto" placeholder="blur" />
          <h2 className="text-base md:text-xl">Looking for a room?</h2>
          <p className="text-muted-foreground">
            Are you looking for a room and couldn&apos;t find one? Click the button below to post an Ad in roommates and
            let others find you.
          </p>
          <Link href="/roommate/create" legacyBehavior passHref>
            <Button className="mt-2">
              <TagsIcon className="mr-1 w-4" />
              Post a Roommate Ad
            </Button>
          </Link>
        </div>
      </div>
    </FullWrapper>
  );
}
