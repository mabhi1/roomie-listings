import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/prisma/db/users";
import FullWrapper from "@/components/page/FullWrapper";
import Comments from "@/components/page/Comments";
import { getRoomById } from "@/prisma/db/roomAds";
import RoomButtons from "@/components/buttons/RoomButtons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GalleryCarousel from "@/components/page/Carousel";
import PosterIcon from "@/components/page/PosterIcon";

export default async function RoomId({ params: { id } }: { params: { id: string } }) {
  const room = await getRoomById(id);
  if (!room) throw new Error("Room ad not found");
  const poster = await getUserById(room.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Room Available"
        backButton
        subHeading="Reach out by sending a message if you like the ad below."
      />
      <Card>
        <CardHeader className="flex-col-reverse justify-between gap-1 space-y-0 p-3 md:flex-row md:items-center md:gap-2 md:space-y-1.5 md:p-5 lg:gap-0">
          <div className="mr-auto md:space-y-1.5">
            <CardTitle className="font-light">{room.title}</CardTitle>
            <CardDescription>
              <span className="text-xs italic ">
                Last Updated:{" "}
                {room.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
            {room.showEmail && <p className="mr-1 hidden text-xs md:block lg:mr-5">User Email: {poster.email}</p>}
          </div>
          {room.showEmail && <p className="mr-auto text-xs md:hidden lg:mr-5">User Email: {poster.email}</p>}
          <PosterIcon poster={poster} />
        </CardHeader>
        <CardContent className="space-y-5 px-0">
          <Table>
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Location</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Rent</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Move In</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Stay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b py-2 text-center">{`${room.address.city}, ${room.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(room.rent)}
                </TableCell>
                <TableCell className="border-b py-2 text-center">
                  {room.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">{room.stay}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="px-3 md:px-6">{room.description}</div>
          {room.gallery.length > 0 && (
            <div className="mx-auto w-full md:mx-0 md:px-16">
              <GalleryCarousel gallery={room.gallery} />
            </div>
          )}
        </CardContent>
        <RoomButtons ad={room} />
      </Card>
      {/* <Comments id={id} type="room" /> */}
    </FullWrapper>
  );
}
