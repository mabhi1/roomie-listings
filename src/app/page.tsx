import { Rubik } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const raleway = Rubik({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="mt-24 flex flex-col gap-10 justify-center items-center w-full max-w-screen-xl mx-auto">
      <h1 className={cn("text-3xl flex gap-2", raleway.className)}>
        <span className="uppercase">Welcome to</span>
        <span className="uppercase bg-primary rounded px-1 text-accent">akash</span>
      </h1>
      <div className="text-7xl text-center">
        You are at the right place to look for property, roommate, and buy, rent, sell stuff.
      </div>
      <span className="text-2xl">Click one of the buttons below to continue searching</span>
      <div className="flex justify-between gap-5">
        <Link href="/roommate">
          <Button>Roommate</Button>
        </Link>
        <Link href="/property">
          <Button>Property</Button>
        </Link>
        <Link href="/products">
          <Button>Products</Button>
        </Link>
      </div>
    </div>
  );
}
