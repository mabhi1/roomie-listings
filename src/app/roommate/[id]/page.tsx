import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RoommateButtons from "@/components/page/RoommateButtons";
import FullWrapper from "@/components/page/FullWrapper";
import Comments from "@/components/page/Comments";

export default async function RoommateId({ params: { id } }: { params: { id: string } }) {
  const roommate = await getRoommateById(id);
  if (!roommate) throw new Error("Invalid Roommate Ad");
  const poster = await getUserById(roommate.postedBy);

  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="Roommate Available" backButton />
      <Card>
        <CardHeader className="p-5 flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="font-light">{roommate.title}</CardTitle>
            <CardDescription>
              <span className="italic text-xs ">
                Last Updated:{" "}
                {roommate.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
          </div>
          <Link href={`user/${poster.uid}`} className="hover:scale-110 transition">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="rounded-full w-fit overflow-clip">
                    <Image
                      src={poster.photo ? poster.photo : "/user.png"}
                      alt={poster.name!}
                      width={60}
                      height={60}
                      className="w-auto"
                      priority
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{poster.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>{roommate.description}</div>
          <div className="grid grid-cols-2 gap-2 w-fit">
            <span className="p-1 bg-secondary-foreground text-accent rounded w-fit">Location</span>
            <span>{`${roommate.address.city}, ${roommate.address.state}`}</span>
            <span className="p-1 bg-secondary-foreground text-accent rounded w-fit">Budget</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(roommate.budget)}
            </span>
            <span className="p-1 bg-secondary-foreground text-accent rounded w-fit">Duration</span>
            <span>{roommate.duration}</span>
          </div>
        </CardContent>
        <RoommateButtons ad={roommate} />
      </Card>
      <Comments id={id} />
    </FullWrapper>
  );
}
