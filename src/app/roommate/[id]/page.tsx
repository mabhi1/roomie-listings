import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import RoommateButtons from "@/components/buttons/RoommateButtons";
import FullWrapper from "@/components/page/FullWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PosterIcon from "@/components/page/PosterIcon";
import ShareButton from "@/components/page/ShareButton";
import ProtectedComponent from "@/components/page/ProtectedComponent";
import { RoommateAd } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export default async function RoommateId({ params: { id } }: { params: { id: string } }) {
  const roommate = (await getRoommateById(id)) as RoommateAd;
  if (!roommate) throw new Error("Roommate ad not found");
  const poster = await getUserById(roommate.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading={`${roommate.propertyType} wanted in ${roommate.address.city}, ${roommate.address.state}`}
        backButton
        subHeading="Reach out by sending a message if you like the ad below."
        element={
          <ShareButton
            onlyIcon={false}
            text={`${roommate.propertyType} wanted in ${roommate.address.city}, ${roommate.address.state}`.toUpperCase()}
            title="Roomie Listings"
            url={`https://www.roomielistings.com/roommate/${roommate.id}`}
          />
        }
      />
      <Card>
        <CardHeader className="flex-col-reverse justify-between gap-1 space-y-0 p-3 md:flex-row md:gap-2 md:space-y-1.5 md:p-5 lg:gap-0">
          <div className="mr-auto w-full space-y-1.5 md:w-[38rem] lg:w-[50rem] xl:w-[68rem]">
            <CardTitle className="text-lg font-light md:text-xl lg:text-2xl">{roommate.title}</CardTitle>
            <CardDescription>
              <span className="text-xs italic ">
                Last Updated:{" "}
                {roommate.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
            {roommate.showEmail && (
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
                text={`${roommate.propertyType} wanted in ${roommate.address.city}, ${roommate.address.state}`.toUpperCase()}
                title="Roomie Listings"
                url={`https://www.roomielistings.com/roommate/${roommate.id}`}
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
                  <div className="min-w-12">Move in</div>
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
                <TableCell className="border-b py-2 text-center">{`${roommate.address.city}, ${roommate.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(roommate.rent)}{" "}
                  {roommate.roomRequirements.rentType}
                </TableCell>
                <TableCell className="border-b py-2 text-center">
                  {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">{roommate.propertyType}</TableCell>
                <TableCell className="border-b py-2 text-center capitalize">
                  {roommate.roomRequirements.accomodates}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize text-primary">
                  {roommate.roomRequirements.gender}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">
                  {roommate.roomRequirements.stay === "both" ? "Any" : `${roommate.roomRequirements.stay} term`}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">
                  {roommate.roomRequirements.attachedBath ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex-1 space-y-3 md:space-y-5">
            {roommate.description && <div className="px-3 md:px-6">{roommate.description}</div>}
            <div className="mx-3 flex w-fit flex-wrap items-center gap-1 rounded border bg-primary-foreground px-1 py-1 md:mx-6">
              <span>Amenities Preferred:</span>
              <span className="capitalize">
                {roommate.roomRequirements.amenities.length > 0
                  ? roommate.roomRequirements.amenities.join(", ")
                  : "N/A"}
              </span>
            </div>
            <div className="mx-3 flex w-fit flex-wrap items-center gap-1 overflow-hidden text-ellipsis text-nowrap rounded border bg-primary-foreground px-1 py-1 md:mx-6">
              <span className="mr-1">Additional Preferences:</span>
              <div className="flex flex-wrap">
                <span>{roommate.roomRequirements.furnished ? "Furnished" : "Not Furnished"}</span>
                {roommate.roomRequirements.vegetarian && <span>, Vegetarian Preferred</span>}
                {roommate.roomRequirements.petFriendly && <span>, Pet Friendly</span>}
                {roommate.roomRequirements.smoking && (
                  <span className="capitalize">
                    {roommate.roomRequirements.smoking === "no"
                      ? ", No preference"
                      : `, Smoking ${roommate.roomRequirements.smoking}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <RoommateButtons ad={roommate} />
      </Card>
    </FullWrapper>
  );
}
