import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getHouseAdsByUser } from "@/prisma/db/houseAds";
import { getRoommateAdsByUser } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";
import userImage from "../../../../public/user.png";

export default async function UserPublicProfile({ params: { id } }: { params: { id: string } }) {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");
  const houseAds = await getHouseAdsByUser(user.uid, "postedAds");
  const roommateAds = await getRoommateAdsByUser(user.uid, "postedAds");
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="User Profile"
        subHeading="This is the public profile page. All the posted ads by the user are listed below."
      />
      <div className="flex gap-5 items-center">
        <div className="rounded-full w-fit h-fit overflow-clip">
          <Image
            src={user.photo ? user.photo : userImage}
            alt={user.name!}
            width={50}
            height={50}
            className="w-[60px] h-[60px] xl:w-[80px] xl:h-[80px] object-cover"
            priority
            placeholder="blur"
            blurDataURL={user.photo ? user.photo : ""}
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
                <TableHead className="border-r font-normal text-accent-foreground h-8">Title</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">City</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Price</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Available</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8 hidden lg:table-cell">
                  Duration
                </TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8 hidden lg:table-cell">
                  Reports
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houseAds?.map((house) => (
                <TableRow className="hover:bg-inherit" key={house.id}>
                  <TableCell className="border-r py-1 pl-4">
                    <Link
                      href={`/house/${house.id}`}
                      className="block w-[260px] md:w-[350px] xl:w-[650px] overflow-hidden"
                    >
                      <Button variant="link" className="p-0">
                        {house.title}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-r text-center py-1">{house.address.city}</TableCell>
                  <TableCell className="border-r text-center py-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(house.price)}
                  </TableCell>
                  <TableCell className="border-r text-center py-1">
                    {house.available.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="border-r text-center capitalize py-1 hidden lg:table-cell">
                    {house.duration}
                  </TableCell>
                  <TableCell className="border-r text-center capitalize py-1 hidden lg:table-cell">
                    {house.reports.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>No posted house ads</div>
      )}
      {roommateAds && roommateAds.length > 0 ? (
        <div className="space-y-3">
          <div>Posted roommate ads</div>
          <Table className="border">
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="border-r font-normal text-accent-foreground h-8">Title</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">City</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Budget</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Move in</TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8 hidden lg:table-cell">
                  Duration
                </TableHead>
                <TableHead className="border-r text-center font-normal text-accent-foreground h-8 hidden lg:table-cell">
                  Reports
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roommateAds.map((roommate) => (
                <TableRow className="hover:bg-inherit" key={roommate.id}>
                  <TableCell className="border-r py-1 pl-4">
                    <Link
                      href={`/roommate/${roommate.id}`}
                      className="block w-[260px] md:w-[350px] xl:w-[650px] overflow-hidden"
                    >
                      <Button variant="link" className="p-0">
                        {roommate.title}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-r text-center py-1">{roommate.address.city}</TableCell>
                  <TableCell className="border-r text-center py-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(roommate.budget)}
                  </TableCell>
                  <TableCell className="border-r text-center py-1 min-w-20">
                    {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="border-r text-center capitalize py-1 hidden lg:table-cell">
                    {roommate.duration}
                  </TableCell>
                  <TableCell className="border-r text-center capitalize py-1 hidden lg:table-cell">
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
