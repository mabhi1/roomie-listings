import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRoomAdsByUser } from "@/prisma/db/roomAds";
import { getRoommateAdsByUser } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";
import userImage from "../../../../public/user.png";

export default async function UserPublicProfile({ params: { id } }: { params: { id: string } }) {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");
  const roomAds = await getRoomAdsByUser(user.uid, "postedAds");
  const roommateAds = await getRoommateAdsByUser(user.uid, "postedAds");
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="User Profile"
        subHeading="This is the public profile page. All the posted ads by the user are listed below."
      />
      <div className="flex items-center gap-5">
        <div className="h-fit w-fit overflow-clip rounded-full">
          <Image
            src={user.photo ? user.photo : userImage}
            alt={user.name!}
            width={50}
            height={50}
            className="h-[60px] w-[60px] object-cover xl:h-[80px] xl:w-[80px]"
            priority
            placeholder="blur"
            blurDataURL={user.photo ? user.photo : ""}
          />
        </div>
        <div className="text-lg">{user.name}</div>
      </div>
      {roomAds && roomAds.length > 0 ? (
        <div className="space-y-3">
          <div>Posted room ads</div>
          <Table className="border">
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 border-r font-normal text-accent-foreground">Title</TableHead>
                <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">City</TableHead>
                <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Rent</TableHead>
                <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Move In</TableHead>
                <TableHead className="hidden h-8 border-r text-center font-normal text-accent-foreground lg:table-cell">
                  Stay
                </TableHead>
                <TableHead className="hidden h-8 border-r text-center font-normal text-accent-foreground lg:table-cell">
                  Reports
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomAds?.map(room => (
                <TableRow className="hover:bg-inherit" key={room.id}>
                  <TableCell className="border-r py-1 pl-4">
                    <Link
                      href={`/room/${room.id}`}
                      className="block w-[260px] overflow-hidden md:w-[350px] xl:w-[650px]"
                    >
                      <Button variant="link" className="p-0">
                        {room.title}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-r py-1 text-center">{room.address.city}</TableCell>
                  <TableCell className="border-r py-1 text-center">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(room.rent)}
                  </TableCell>
                  <TableCell className="border-r py-1 text-center">
                    {room.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="hidden border-r py-1 text-center capitalize lg:table-cell">
                    {room.stay}
                  </TableCell>
                  <TableCell className="hidden border-r py-1 text-center capitalize lg:table-cell">
                    {room.reports.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>No posted room ads</div>
      )}
      {roommateAds && roommateAds.length > 0 ? (
        <div className="space-y-3">
          <div>Posted roommate ads</div>
          <Table className="border">
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 border-r font-normal text-accent-foreground">Title</TableHead>
                <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">City</TableHead>
                <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Budget</TableHead>
                <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Move in</TableHead>
                <TableHead className="hidden h-8 border-r text-center font-normal text-accent-foreground lg:table-cell">
                  Stay
                </TableHead>
                <TableHead className="hidden h-8 border-r text-center font-normal text-accent-foreground lg:table-cell">
                  Reports
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roommateAds.map(roommate => (
                <TableRow className="hover:bg-inherit" key={roommate.id}>
                  <TableCell className="border-r py-1 pl-4">
                    <Link
                      href={`/roommate/${roommate.id}`}
                      className="block w-[260px] overflow-hidden md:w-[350px] xl:w-[650px]"
                    >
                      <Button variant="link" className="p-0">
                        {roommate.title}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-r py-1 text-center">{roommate.address.city}</TableCell>
                  <TableCell className="border-r py-1 text-center">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(roommate.budget)}
                  </TableCell>
                  <TableCell className="min-w-20 border-r py-1 text-center">
                    {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="hidden border-r py-1 text-center capitalize lg:table-cell">
                    {roommate.stay}
                  </TableCell>
                  <TableCell className="hidden border-r py-1 text-center capitalize lg:table-cell">
                    {roommate.reports.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>No posted roommate ads</div>
      )}
    </FullWrapper>
  );
}
