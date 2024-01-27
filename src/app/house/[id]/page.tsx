import PageHeader from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/prisma/db/users";
import FullWrapper from "@/components/page/FullWrapper";
import Comments from "@/components/page/Comments";
import { getHouseById } from "@/prisma/db/houseAds";
import HouseButtons from "@/components/buttons/HouseButtons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GalleryCarousel from "@/components/page/Carousel";
import PosterIcon from "@/components/page/PosterIcon";

export default async function HouseId({ params: { id } }: { params: { id: string } }) {
  const house = await getHouseById(id);
  if (!house) throw new Error("Invalid House Ad");
  const poster = await getUserById(house.postedBy);

  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="House Available"
        backButton
        subHeading="Reach out by sending a message if you like the ad below."
      />
      <Card>
        <CardHeader className="flex-col-reverse justify-between gap-1 space-y-0 p-3 md:flex-row md:items-center md:gap-2 md:space-y-1.5 md:p-5 lg:gap-0">
          <div className="mr-auto md:space-y-1.5">
            <CardTitle className="font-light">{house.title}</CardTitle>
            <CardDescription>
              <span className="text-xs italic ">
                Last Updated:{" "}
                {house.updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </CardDescription>
            {house.showEmail && <p className="mr-1 hidden text-xs md:block lg:mr-5">User Email: {poster.email}</p>}
          </div>
          {house.showEmail && <p className="mr-auto text-xs md:hidden lg:mr-5">User Email: {poster.email}</p>}
          <PosterIcon poster={poster} />
        </CardHeader>
        <CardContent className="space-y-5 px-0">
          <Table>
            <TableHeader className="h-6">
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Location</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Price</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Available</TableHead>
                <TableHead className="h-8 text-center font-normal text-accent-foreground">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-inherit">
                <TableCell className="border-b py-2 text-center">{`${house.address.city}, ${house.address.state}`}</TableCell>
                <TableCell className="border-b py-2 text-center">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(house.price)}
                </TableCell>
                <TableCell className="border-b py-2 text-center">
                  {house.available.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell className="border-b py-2 text-center capitalize">{house.duration}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="px-3 md:px-6">{house.description}</div>
          {house.gallery.length > 0 && (
            <div className="mx-auto w-fit md:mx-0 md:px-16">
              <GalleryCarousel gallery={house.gallery} />
            </div>
          )}
        </CardContent>
        <HouseButtons ad={house} />
      </Card>
      <Comments id={id} type="house" />
    </FullWrapper>
  );
}
