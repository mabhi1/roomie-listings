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
import AmenitiesComponent from "@/components/page/AmenitiesComponent";
import AdditionalInfoComponent from "@/components/page/AdditionalInfoComponent";

export default async function RoommateId({ params: { id } }: { params: { id: string } }) {
  const roommate = (await getRoommateById(id)) as RoommateAd;
  if (!roommate) throw new Error("Roommate ad not found");
  const poster = await getUserById(roommate.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading={`${roommate.propertyType} wanted in ${roommate.address.city}, ${roommate.address.state}`}
        mobileHeading={`${roommate.propertyType} wanted`}
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
          <div className="mr-auto w-full space-y-2 md:w-[38rem] lg:w-[50rem] xl:w-[68rem]">
            <CardTitle className="text-lg font-light capitalize md:text-xl lg:text-2xl">{roommate.title}</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Last Updated:{" "}
              {roommate.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
            </CardDescription>
            {roommate.showEmail && (
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
                text={`${roommate.propertyType} wanted in ${roommate.address.city}, ${roommate.address.state}`.toUpperCase()}
                title="Roomie Listings"
                url={`https://www.roomielistings.com/roommate/${roommate.id}`}
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
                  <div className="min-w-12">Move in</div>
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
                <TableCell className="border-b py-2 text-center font-medium">{`${roommate.address.city}, ${roommate.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(roommate.rent)}{" "}
                  {roommate.roomRequirements.rentType}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium">
                  {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {roommate.propertyType}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {`${roommate.roomRequirements.accomodates} ${roommate.roomRequirements.accomodates === 1 ? "person" : "people"}`}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize text-primary">
                  {roommate.roomRequirements.gender}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {roommate.roomRequirements.stay === "both" ? "Any" : `${roommate.roomRequirements.stay} term`}
                </TableCell>
                <TableCell className="border-b py-2 text-center font-medium capitalize">
                  {roommate.roomRequirements.attachedBath ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex-1 space-y-3 md:space-y-5">
            <div>
              <div className="p-3 text-sm leading-none tracking-tight underline underline-offset-2 md:p-5 md:text-lg">
                Description
              </div>
              <div className="flex flex-col gap-1 p-3 md:p-5 md:pt-0">
                <div className="mb-2 flex w-fit gap-2 rounded border bg-muted p-1 px-2 font-medium">
                  <div className="uppercase">Address :</div>
                  <div>{`${roommate.address.city}, ${roommate.address.state}`}</div>
                </div>
                {roommate.description &&
                  roommate.description.split("\n").map((line, idx) => (
                    <div key={idx} className={line === "" ? "h-2" : ""}>
                      {line}
                    </div>
                  ))}
              </div>
            </div>
            <Separator />
            {roommate.roomRequirements.amenities.length > 0 && (
              <>
                <AmenitiesComponent amenities={roommate.roomRequirements.amenities} />
                <Separator />
              </>
            )}
            <AdditionalInfoComponent requirements={roommate.roomRequirements} page="roommate" />
          </div>
        </CardContent>
        <Separator />
        <RoommateButtons ad={roommate} receiver={poster} />
      </Card>
    </FullWrapper>
  );
}
