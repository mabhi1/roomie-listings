import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RoommateButtons from "@/components/buttons/RoommateButtons";
import FullWrapper from "@/components/page/FullWrapper";
import Comments from "@/components/page/Comments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function RoommateId({ params: { id } }: { params: { id: string } }) {
  const roommate = await getRoommateById(id);
  if (!roommate) throw new Error("Invalid Roommate Ad");
  const poster = await getUserById(roommate.postedBy);

  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="Roommate Available" backButton />
      <Card>
        <CardHeader className="p-5 flex-row items-center justify-between">
          <div className="space-y-1.5 mr-auto">
            <CardTitle className="font-light">{roommate.title}</CardTitle>
            <CardDescription>
              <span className="italic text-xs ">
                Last Updated:{" "}
                {roommate.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
          </div>
          {roommate.showEmail && <p className="text-xs mr-5 text-muted-foreground">{poster.email}</p>}
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
                  <p className="text-xs">Go to profile</p>
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
                <TableHead className="text-center font-normal text-accent-foreground h-8">Budget</TableHead>
                <TableHead className="text-center font-normal text-accent-foreground h-8">Move in</TableHead>
                <TableHead className="text-center font-normal text-accent-foreground h-8">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b text-center py-2">{`${roommate.address.city}, ${roommate.address.state}`}</TableCell>
                <TableCell className="border-b text-center py-2">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(roommate.budget)}
                </TableCell>
                <TableCell className="border-b text-center py-2">
                  {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b text-center capitalize py-2">{roommate.duration}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="px-6">{roommate.description}</div>
        </CardContent>
        <RoommateButtons ad={roommate} />
      </Card>
      <Comments id={id} type="roommate" />
    </FullWrapper>
  );
}
