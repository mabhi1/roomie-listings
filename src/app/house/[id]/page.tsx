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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function HouseId({ params: { id } }: { params: { id: string } }) {
  const house = await getHouseById(id);
  if (!house) throw new Error("Invalid House Ad");
  const poster = await getUserById(house.postedBy);

  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="House Available" backButton />
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
        <CardContent className="space-y-5 px-0">
          <Table>
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="text-center font-normal text-accent-foreground h-8">Location</TableHead>
                <TableHead className="text-center font-normal text-accent-foreground h-8">Price</TableHead>
                <TableHead className="text-center font-normal text-accent-foreground h-8">Available</TableHead>
                <TableHead className="text-center font-normal text-accent-foreground h-8">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b text-center py-2">{`${house.address.city}, ${house.address.state}`}</TableCell>
                <TableCell className="border-b text-center py-2">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(house.price)}
                </TableCell>
                <TableCell className="border-b text-center py-2">
                  {house.available.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b text-center capitalize py-2">{house.duration}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="px-6">{house.description}</div>
        </CardContent>
        <HouseButtons ad={house} />
      </Card>
      <Comments id={id} type="house" />
    </FullWrapper>
  );
}
