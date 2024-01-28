import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import RoommateButtons from "@/components/buttons/RoommateButtons";
import FullWrapper from "@/components/page/FullWrapper";
import Comments from "@/components/page/Comments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PosterIcon from "@/components/page/PosterIcon";

export default async function RoommateId({ params: { id } }: { params: { id: string } }) {
  const roommate = await getRoommateById(id);
  if (!roommate) throw new Error("Roommate ad not found");
  const poster = await getUserById(roommate.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Roommate Available"
        backButton
        subHeading="Reach out by sending a message if you like the ad below."
      />
      <Card>
        <CardHeader className="flex-col-reverse justify-between gap-1 space-y-0 p-3 md:flex-row md:items-center md:gap-2 md:space-y-1.5 md:p-5 lg:gap-0">
          <div className="mr-auto md:space-y-1.5">
            <CardTitle className="text-lg font-light md:text-xl lg:text-2xl">{roommate.title}</CardTitle>
            <CardDescription>
              <span className="text-xs italic ">
                Last Updated:{" "}
                {roommate.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
            {roommate.showEmail && <p className="mr-1 hidden text-xs md:block lg:mr-5">User Email: {poster.email}</p>}
          </div>
          {roommate.showEmail && <p className="mr-auto text-xs md:hidden lg:mr-5">User Email: {poster.email}</p>}
          <PosterIcon poster={poster} />
        </CardHeader>
        <CardContent className="space-y-5 px-0">
          <Table>
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Location</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Budget/Month</TableHead>
                <TableHead className="h-8 w-20 text-center font-normal text-accent-foreground md:w-auto">
                  <div className="min-w-12">Move In</div>
                </TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Stay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b py-2 text-center">{`${roommate.address.city}, ${roommate.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(roommate.budget)}
                </TableCell>
                <TableCell className="border-b py-2 text-center">
                  {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">{roommate.stay}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="px-3 md:px-6">{roommate.description}</div>
        </CardContent>
        <RoommateButtons ad={roommate} />
      </Card>
      {/* <Comments id={id} type="roommate" /> */}
    </FullWrapper>
  );
}
