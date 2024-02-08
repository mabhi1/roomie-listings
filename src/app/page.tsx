import { Rubik } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FullWrapper from "@/components/page/FullWrapper";
import { HotelIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { navigation, title } from "@/lib/constants";
import RecentlyAddedAds from "@/components/page/RecentlyAddedAds";

const raleway = Rubik({ subsets: ["latin"] });

export default function Home() {
  return (
    <FullWrapper className="my-5 items-center gap-5 py-5 md:gap-10 xl:my-10">
      <h1 className={cn("flex gap-2 text-xl md:text-2xl xl:text-3xl", raleway.className)}>
        <span className="uppercase">Welcome to</span>
        <span className="rounded bg-primary px-1 uppercase text-accent">{title.site}</span>
      </h1>
      <div className="w-4/5 text-center text-2xl uppercase md:text-3xl xl:text-4xl">
        You are at the right place to look for a roommate or rent a room.
      </div>
      <span className="flex items-center text-center text-lg md:text-xl xl:text-2xl">
        <MapPinIcon className="mr-1 w-4 md:w-5 xl:w-6" />
        Currently live in New Jersey
      </span>
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:gap-5 xl:mb-10">
        <span className="text-center text-lg md:text-xl xl:text-2xl">Click to start browsing</span>
        <Link href={navigation.roommate} legacyBehavior passHref>
          <Button>
            <UsersIcon className="mr-1 w-4" />
            {title.roommate}
          </Button>
        </Link>
        <Link href={navigation.room} legacyBehavior passHref>
          <Button>
            <HotelIcon className="mr-1 w-4" />
            {title.room}
          </Button>
        </Link>
      </div>
      {/* <div className="w-full space-y-5 border-y p-5">
        <div className="text-xl capitalize">Recently added rental ads</div>
        <RecentlyAddedAds type="room" />
      </div> */}
    </FullWrapper>
  );
}
