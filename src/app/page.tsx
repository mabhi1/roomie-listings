import { Rubik } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FullWrapper from "@/components/page/FullWrapper";
import { BedDoubleIcon, HotelIcon, UsersIcon } from "lucide-react";

const raleway = Rubik({ subsets: ["latin"] });

export default function Home() {
  return (
    <FullWrapper className="pt-24 flex flex-col gap-10 justify-center items-center">
      <h1 className={cn("text-3xl flex gap-2", raleway.className)}>
        <span className="uppercase">Welcome to</span>
        <span className="uppercase bg-primary rounded px-1 text-accent">Aakash</span>
      </h1>
      <div className="text-7xl text-center">
        You are at the right place to look for property, roommate, and buy, rent, sell stuff.
      </div>
      <span className="text-2xl">Click one of the buttons below to continue browsing</span>
      <div className="flex justify-between gap-5">
        <Link href="/roommate" legacyBehavior passHref>
          <Button>
            <UsersIcon className="w-4 mr-1" />
            Roommate
          </Button>
        </Link>
        <Link href="/property" legacyBehavior passHref>
          <Button>
            <HotelIcon className="w-4 mr-1" />
            Property
          </Button>
        </Link>
        <Link href="/products" legacyBehavior passHref>
          <Button>
            <BedDoubleIcon className="w-4 mr-1" />
            Products
          </Button>
        </Link>
      </div>
    </FullWrapper>
  );
}
