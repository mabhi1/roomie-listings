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
      <div className="text-center text-2xl uppercase md:w-4/5 md:text-3xl xl:text-4xl">
        You are at the right place to look for a roommate or rent a room.
      </div>
      <span className="flex items-center text-center text-lg md:text-xl xl:text-2xl">
        <MapPinIcon className="mr-1 w-4 md:w-5 xl:w-6" />
        Currently live in New Jersey only
      </span>
      <div className="flex flex-col gap-5 md:w-4/5 md:flex-row">
        <div className="hidden text-right text-lg md:block md:w-2/3 md:text-xl lg:w-1/2 xl:text-2xl">Looking for</div>
        <div className="flex flex-wrap justify-center gap-3 md:justify-start md:gap-5">
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
          <Link href="/room?property=private%20room" legacyBehavior passHref>
            <Button>
              <HotelIcon className="mr-1 w-4" />
              Private Room
            </Button>
          </Link>
          <Link href="/room?stay=short" legacyBehavior passHref>
            <Button>
              <HotelIcon className="mr-1 w-4" />
              Temporary Accomodations
            </Button>
          </Link>
          <Link href="/room?property=shared%20room" legacyBehavior passHref>
            <Button>
              <HotelIcon className="mr-1 w-4" />
              Shared Room
            </Button>
          </Link>
          <Link href="/room?property=house" legacyBehavior passHref>
            <Button>
              <HotelIcon className="mr-1 w-4" />
              House
            </Button>
          </Link>
          <Link href="/room?gender=male" legacyBehavior passHref>
            <Button>
              <HotelIcon className="mr-1 w-4" />A Male Roommate
            </Button>
          </Link>
          <Link href="/room?gender=female" legacyBehavior passHref>
            <Button>
              <HotelIcon className="mr-1 w-4" />A Female Roommate
            </Button>
          </Link>
        </div>
      </div>
      {/* <div className="mt-5 w-full space-y-5 border-y p-5 md:mt-10">
        <div className="text-xl capitalize">Recently added rental ads</div>
        <RecentlyAddedAds type="room" />
      </div> */}
    </FullWrapper>
  );
}
