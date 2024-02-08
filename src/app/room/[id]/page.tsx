import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/prisma/db/users";
import FullWrapper from "@/components/page/FullWrapper";
import { getRoomById } from "@/prisma/db/roomAds";
import RoomButtons from "@/components/buttons/RoomButtons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GalleryCarousel from "@/components/page/Carousel";
import PosterIcon from "@/components/page/PosterIcon";
import { Separator } from "@/components/ui/separator";
import ProtectedComponent from "@/components/page/ProtectedComponent";
import ShareButton from "@/components/page/ShareButton";
import { RoomAd } from "@/lib/types";
import AmenitiesComponent from "@/components/page/AmenitiesComponent";
import AdditionalInfoComponent from "@/components/page/AdditionalInfoComponent";

export default async function RoomId({ params: { id } }: { params: { id: string } }) {
  const room = (await getRoomById(id)) as RoomAd;
  if (!room) throw new Error("Room ad not found");
  const poster = await getUserById(room.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading={`${room.propertyType} available in ${room.address.city}, ${room.address.state}`}
        mobileHeading={`${room.propertyType} available`}
        backButton
        subHeading="Reach out by sending a message if you like the ad below."
        element={
          <ShareButton
            onlyIcon={false}
            text={`${room.propertyType} available in ${room.address.city}, ${room.address.state}`.toUpperCase()}
            title="Roomie Listings"
            url={`https://www.roomielistings.com/room/${room.id}`}
          />
        }
      />
      <Card>
        <CardHeader className="flex-col-reverse justify-between gap-1 space-y-0 p-3 md:flex-row md:items-center md:gap-2 md:space-y-1.5 md:p-5 lg:gap-0">
          <div className="mr-auto w-full space-y-2 md:w-[38rem] lg:w-[50rem] xl:w-[68rem]">
            <CardTitle className="text-lg font-light capitalize md:text-xl lg:text-2xl">{room.title}</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Last Updated:{" "}
              {room.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
            </CardDescription>
            {room.showEmail && (
              <ProtectedComponent
                userMessage="Please sign in to see user email"
                className="mr-1 text-muted-foreground lg:mr-5"
              >
                {<p className="mr-1 break-words text-muted-foreground lg:mr-5">User Email: {poster.email}</p>}
              </ProtectedComponent>
            )}
          </div>
          <div className="flex h-fit items-start justify-between gap-3">
            <PosterIcon poster={poster} />
            <div className="md:hidden">
              <ShareButton
                onlyIcon={false}
                text={`${room.propertyType} available in ${room.address.city}, ${room.address.state}`.toUpperCase()}
                title="Roomie Listings"
                url={`https://www.roomielistings.com/room/${room.id}`}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-3 md:space-y-5 md:pb-6">
          <Table>
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 text-center font-normal text-muted-foreground">
                  <div className="min-w-16">Location</div>
                </TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">Rent</TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">
                  <div className="min-w-12">Available from</div>
                </TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">Type</TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">Accomodates</TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">Gender</TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">Stay type</TableHead>
                <TableHead className="h-8 text-center font-normal text-muted-foreground">Attached Bath</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b py-2 text-center font-medium">{`${room.address.city}, ${room.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(room.rent)}{" "}
                  {room.roomRequirements.rentType}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium">
                  {room.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">{room.propertyType}</TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {`${room.roomRequirements.accomodates} ${room.roomRequirements.accomodates === 1 ? "person" : "people"}`}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize text-primary">
                  {room.roomRequirements.gender}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {room.roomRequirements.stay === "both" ? "Any" : `${room.roomRequirements.stay} term`}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {room.roomRequirements.attachedBath ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 space-y-3 md:space-y-5">
              <div>
                <div className="p-3 text-sm leading-none tracking-tight underline underline-offset-2 md:p-5 md:text-lg">
                  Description
                </div>
                <div className="flex flex-col gap-1 p-3 md:p-5 md:pr-0 md:pt-0">
                  <div className="mb-2 flex w-fit gap-2 rounded border bg-muted p-1 px-2 font-medium">
                    <div className="uppercase">Address :</div>
                    <div>{`${room.address.address1} ${room.address.city}, ${room.address.state} ${room.address.zip}`}</div>
                  </div>
                  {room.description &&
                    room.description.split("\n").map((line, idx) => (
                      <div key={idx} className={line === "" ? "h-2" : ""}>
                        {line}
                      </div>
                    ))}
                </div>
              </div>
              <Separator />
              {room.roomRequirements.amenities.length > 0 && (
                <>
                  <AmenitiesComponent amenities={room.roomRequirements.amenities} />
                  <Separator />
                </>
              )}
              <AdditionalInfoComponent requirements={room.roomRequirements} page="room" />
            </div>
            {room.gallery.length > 0 && (
              <div className="top-24 mb-5 h-48 w-full pt-4 md:sticky md:w-[42%] lg:h-[24rem]">
                <div className="mx-auto w-full md:mx-0 md:px-16">
                  <GalleryCarousel gallery={room.gallery} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <Separator />
        <RoomButtons ad={room} receiver={poster} />
      </Card>
    </FullWrapper>
  );
}
