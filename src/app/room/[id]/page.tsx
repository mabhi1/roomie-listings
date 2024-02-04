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
import { isMobile } from "react-device-detect";

export default async function RoomId({ params: { id } }: { params: { id: string } }) {
  const room = await getRoomById(id);
  if (!room) throw new Error("Room ad not found");
  const poster = await getUserById(room.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading={
          isMobile
            ? `${room.propertyType} available`
            : `${room.propertyType} available in ${room.address.city}, ${room.address.state}`
        }
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
          <div className="mr-auto w-full md:w-[38rem] md:space-y-1.5 lg:w-[50rem] xl:w-[68rem]">
            <CardTitle className="text-lg font-light md:text-xl lg:text-2xl">{room.title}</CardTitle>
            <CardDescription>
              <span className="text-xs italic ">
                Last Updated:{" "}
                {room.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
            {room.showEmail && (
              <ProtectedComponent userMessage="Please sign in to see user email" className="mr-1 text-xs lg:mr-5">
                {<p className="mr-1 break-words text-xs lg:mr-5">User Email: {poster.email}</p>}
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
        <CardContent className="space-y-5 px-0">
          <Table>
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 text-center font-normal text-accent-foreground">
                  <div className="min-w-16">Location</div>
                </TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Rent</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">
                  <div className="min-w-12">Available from</div>
                </TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Type</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Accomodates</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Gender</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Stay type</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Attached Bath</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b py-2 text-center">{`${room.address.city}, ${room.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(room.rent)}{" "}
                  {room.roomRequirements.rentType}
                </TableCell>
                <TableCell className="border-b py-2 text-center">
                  {room.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">{room.propertyType}</TableCell>
                <TableCell className="border-b py-2 text-center capitalize">
                  {room.roomRequirements.accomodates}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize text-primary">
                  {room.roomRequirements.gender}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">
                  {room.roomRequirements.stay === "both" ? "Any" : `${room.roomRequirements.stay} term`}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">
                  {room.roomRequirements.attachedBath ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1 space-y-3 md:space-y-5">
              {room.description && <div className="px-3 md:px-6">{room.description}</div>}
              <div className="mx-3 flex w-fit flex-wrap items-center gap-1 rounded border bg-primary-foreground px-1 py-1 md:mx-6">
                <span>Amenities:</span>
                <span className="capitalize">
                  {room.roomRequirements.amenities.length > 0 ? room.roomRequirements.amenities.join(", ") : "N/A"}
                </span>
              </div>
              <div className="mx-3 flex w-fit flex-wrap items-center gap-1 overflow-hidden text-ellipsis text-nowrap rounded border bg-primary-foreground px-1 py-1 md:mx-6">
                <span className="mr-1">Additional Info:</span>
                <div className="flex flex-wrap">
                  <span>{room.roomRequirements.furnished ? "Furnished" : "Not Furnished"}</span>
                  {room.roomRequirements.vegetarian && <span>, Vegetarian Preferred</span>}
                  {room.roomRequirements.petFriendly && <span>, Pet Friendly</span>}
                  {room.roomRequirements.smoking && (
                    <span className="capitalize">
                      {room.roomRequirements.smoking === "no"
                        ? ", No preference"
                        : `, Smoking ${room.roomRequirements.smoking}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {room.gallery.length > 0 && (
              <div className="w-full md:w-1/2">
                <div className="mx-auto w-full md:mx-0 md:px-16">
                  <GalleryCarousel gallery={room.gallery} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <Separator />
        <RoomButtons ad={room} />
      </Card>
    </FullWrapper>
  );
}
