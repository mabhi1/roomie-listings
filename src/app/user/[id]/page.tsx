import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getHouseAdsByUser } from "@/prisma/db/houseAds";
import { getRoommateAdsByUser } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";

export default async function UserPublicProfile({ params: { id } }: { params: { id: string } }) {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");
  const houseAds = await getHouseAdsByUser(user.uid, "postedAds");
  const roommateAds = await getRoommateAdsByUser(user.uid, "postedAds");
  return (
    <FullWrapper className="gap-5">
      <PageHeader
        heading="User Profile"
        subHeading="This is your public profile page shown to others. All your posted ads are shown here."
      />
      <div className="flex gap-5 items-center">
        <div className="rounded-full w-fit h-fit overflow-clip">
          <Image
            src={user.photo ? user.photo : "/user.png"}
            alt={user.name!}
            width={50}
            height={50}
            className="w-[100px] h-[100px] object-cover"
            priority
          />
        </div>
        <div className="text-lg">{user.name}</div>
      </div>
      {houseAds && houseAds.length > 0 ? (
        <div className="space-y-3">
          <div>Posted house ads</div>
          <Table className="border">
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/2 border-r font-normal text-accent-foreground h-8">Title</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Location</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Price</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Available</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Duration</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houseAds?.map((house) => (
                <TableRow className="hover:bg-inherit" key={house.id}>
                  <TableCell className="border-r py-1 pl-4">
                    <Link href={`/house/${house.id}`} className="block w-[600px] overflow-hidden">
                      <Button variant="link" className="p-0">
                        {house.title}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-r text-center py-1">{`${house.address.city}, ${house.address.state}`}</TableCell>
                  <TableCell className="border-r text-center py-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(house.price)}
                  </TableCell>
                  <TableCell className="border-r text-center py-1">
                    {house.available.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="border-r text-center capitalize py-1">{house.duration}</TableCell>
                  <TableCell className="border-r text-center capitalize py-1">{house.reports.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>0 posted house ads</div>
      )}
      {roommateAds && roommateAds.length > 0 ? (
        <div className="space-y-3">
          <div>Posted roommate ads</div>
          <Table className="border">
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/2 border-r font-normal text-accent-foreground h-8">Title</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Location</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Budget</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Move in</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Duration</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roommateAds.map((roommate) => (
                <TableRow className="hover:bg-inherit" key={roommate.id}>
                  <TableCell className="border-r py-1 pl-4">
                    <Link href={`/roommate/${roommate.id}`} className="block w-[600px] overflow-hidden">
                      <Button variant="link" className="p-0">
                        {roommate.title}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-r text-center py-1">{`${roommate.address.city}, ${roommate.address.state}`}</TableCell>
                  <TableCell className="border-r text-center py-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(roommate.budget)}
                  </TableCell>
                  <TableCell className="border-r text-center py-1">
                    {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="border-r text-center capitalize py-1">{roommate.duration}</TableCell>
                  <TableCell className="border-r text-center capitalize py-1">{roommate.reports.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>0 posted roommate ads</div>
      )}
    </FullWrapper>
  );
}
