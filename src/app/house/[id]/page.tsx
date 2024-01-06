import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FullWrapper from "@/components/page/FullWrapper";
import Comments from "@/components/page/Comments";
import { getHouseById } from "@/prisma/db/houseAds";
import HouseButtons from "@/components/buttons/HouseButtons";

export default async function HouseId({ params: { id } }: { params: { id: string } }) {
  const house = await getHouseById(id);
  if (!house) throw new Error("Invalid house Ad");
  const poster = await getUserById(house.postedBy);

  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="house Available" backButton />
      <Card>
        <CardHeader className="p-5 flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="font-light">{house.title}</CardTitle>
            <CardDescription>
              <span className="italic text-xs ">
                Last Updated:{" "}
                {house.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
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
          <div>{house.description}</div>
          <div className="grid grid-cols-2 gap-2 w-fit">
            <span className="p-1 bg-secondary-foreground text-accent rounded w-fit">Location</span>
            <span>{`${house.address.city}, ${house.address.state}`}</span>
            <span className="p-1 bg-secondary-foreground text-accent rounded w-fit">Budget</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(house.price)}
            </span>
            <span className="p-1 bg-secondary-foreground text-accent rounded w-fit">Duration</span>
            <span>{house.duration}</span>
          </div>
        </CardContent>
        <HouseButtons ad={house} />
      </Card>
      <Comments id={id} />
    </FullWrapper>
  );
}
