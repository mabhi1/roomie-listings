"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import {
  AwardIcon,
  BeanIcon,
  BeanOffIcon,
  BookTextIcon,
  CableCarIcon,
  CarIcon,
  CigaretteIcon,
  CigaretteOffIcon,
  CoinsIcon,
  DeleteIcon,
  DoorOpenIcon,
  DumbbellIcon,
  FishIcon,
  FishOffIcon,
  HeartIcon,
  HeartOffIcon,
  InfoIcon,
  MapPinIcon,
  MonitorIcon,
  MonitorOffIcon,
  PenLineIcon,
  ShieldAlertIcon,
  ShieldOffIcon,
  ShirtIcon,
  StoreIcon,
  WavesIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { RoomAd, RoommateAd } from "@/lib/types";
import useAuth from "../providers/AuthProvider";
import AdCardInfo from "../ui/ad-card-info";
import { deleteFile } from "@/firebase/firebaseDBFunctions";
import { deleteRoomAds, reportRoom, saveRoom } from "@/actions/room";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ShareButton from "./ShareButton";
import { deleteRoommateAds, reportRoommate, saveRoommate } from "@/actions/roommate";
import AdIcon from "./AdIcon";

export default function IndividualAd({
  ad,
  setAds,
  currentTab,
  list = false,
}: {
  ad: RoomAd | RoommateAd;
  setAds?: Dispatch<SetStateAction<RoomAd[] | RoommateAd[] | null | undefined>>;
  currentTab?: "reportedAds" | "savedAds" | "postedAds";
  list?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [viewed, setViewed] = useState(false);
  const { currentUser } = useAuth();

  const isRental = "gallery" in ad;

  useEffect(() => {
    const visitedAds = sessionStorage.getItem("roomie_listings_visited_ads");
    if (visitedAds && JSON.parse(visitedAds).includes(ad.id)) {
      setViewed(true);
    }
  }, [ad.id]);

  const filterList = (ads: RoomAd[] | RoommateAd[] | null | undefined, updatedAd: RoomAd | RoommateAd) => {
    if (!ads) return [];
    let idx = ads.findIndex(ele => ele.id === ad.id);
    ads.splice(idx, 1, updatedAd);
    return ads;
  };

  const handleDeleteAd = (tab: "reportedAds" | "savedAds" | "postedAds") => {
    startTransition(async () => {
      try {
        if (tab === "postedAds" && isRental)
          ad.gallery.map(async item => {
            await deleteFile(item.name);
          });
        const updatedAd = isRental
          ? ((await deleteRoomAds(currentUser!.uid, ad.id!, tab)) as RoomAd)
          : ((await deleteRoommateAds(currentUser!.uid, ad.id!, tab)) as RoommateAd);
        if (!updatedAd) {
          toast.error("Error removing ad");
          return;
        }
        if (setAds) {
          if (currentTab === tab || tab === "postedAds") setAds(ads => (ads ? ads?.filter(e => e.id !== ad.id) : []));
          else setAds(ads => filterList(ads, updatedAd));
        }
        toast.success("Ad removed successfully");
      } catch (error) {
        toast.error("Error removing ad");
      }
    });
  };

  const handleSaveAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        try {
          const updatedAd = isRental
            ? ((await saveRoom(ad.id!, currentUser.uid)) as RoomAd)
            : ((await saveRoommate(ad.id!, currentUser.uid)) as RoommateAd);
          if (!updatedAd) {
            toast.error("Error adding this ad to favourites");
            return;
          }
          if (setAds) setAds(ads => filterList(ads, updatedAd));
          toast.success("Ad added to favourites");
        } catch (error) {
          toast.error("Error adding to favourites");
        }
      });
  };

  const handleReportAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        try {
          const updatedAd = isRental
            ? ((await reportRoom(ad.id!, currentUser.uid)) as RoomAd)
            : ((await reportRoommate(ad.id!, currentUser.uid)) as RoommateAd);
          if (!updatedAd) {
            toast.error("Error reporting ad");
            return;
          }
          if (setAds) setAds(ads => filterList(ads, updatedAd));
          toast.success("Ad reported successfully");
        } catch (error) {
          toast.error("Error reporting ad");
        }
      });
  };

  const getAmenitiesIcon = (i: string) => {
    switch (i) {
      case "swimming pool":
        return <WavesIcon className="w-4" />;
      case "car park":
        return <CarIcon className="w-4" />;
      case "laundary":
        return <ShirtIcon className="w-4" />;
      case "gym":
        return <DumbbellIcon className="w-4" />;
      case "elevator":
        return <CableCarIcon className="w-4" />;
      case "club house":
        return <StoreIcon className="w-4" />;
    }
  };

  return (
    <Card
      className={cn(
        currentUser?.uid === ad.postedBy && list
          ? "relative border-green-600"
          : viewed && list
            ? "relative border-yellow-600"
            : "border-black/20",
        "text-muted-foreground hover:bg-muted/40 hover:shadow-md",
      )}
    >
      <CardHeader className="rounded-t px-3 py-2 md:py-3">
        <CardTitle className="flex flex-col-reverse items-center gap-1 text-xs font-light md:text-sm lg:flex-row lg:text-base">
          <div className="hidden items-center gap-1 font-normal text-black lg:flex">
            <MapPinIcon className="w-4" />
            {ad.address.city}, {ad.address.state}
            <div>|</div>
          </div>
          <div className="w-full overflow-hidden text-ellipsis text-nowrap lg:w-[25rem] xl:w-[44rem]">{ad.title}</div>
          <Separator className="lg:hidden" />
          <div className="flex w-full items-center gap-1 lg:ml-auto lg:w-fit">
            {list && currentUser?.uid === ad.postedBy ? (
              <div className="absolute -left-[4.2rem] top-5 hidden rounded-l bg-green-600 p-1 px-2 text-xs uppercase text-primary-foreground xl:block">
                your ad
              </div>
            ) : (
              list &&
              viewed && (
                <div className="absolute -left-[3.7rem] top-5 hidden rounded-l bg-yellow-600 p-1 px-2 text-xs uppercase text-primary-foreground xl:block">
                  viewed
                </div>
              )
            )}
            <div className="mr-auto flex items-center font-medium text-black md:gap-1 lg:hidden">
              <MapPinIcon className="w-3 md:w-4" />
              {ad.address.city}, {ad.address.state}
            </div>
            <div className="hidden gap-1 text-xs lg:flex">
              Updated: {ad.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              <div>|</div>
            </div>
            <div className="flex items-center gap-1 font-normal text-black">
              <CoinsIcon className="w-3 md:w-4" />
              Rent: ${ad.rent} {ad.roomRequirements.rentType}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-3 p-2 md:flex-row md:p-3">
        <div className="flex flex-1 flex-col justify-between gap-2 overflow-auto">
          <Table>
            <TableHeader className="[&_tr]:border-b-0">
              <TableRow className="bg-muted/50">
                {[
                  isRental ? "Available from" : "Move in",
                  "Gender",
                  "Stay type",
                  "Type",
                  "Attached Bath",
                  "Accomodates",
                ].map(item => (
                  <TableHead
                    key={item}
                    className="h-7 text-left font-normal text-muted-foreground first:rounded-l last:rounded-r last:border-r-0"
                  >
                    <div className="min-w-12">{item}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {[
                  ad.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" }),
                  ad.roomRequirements.gender,
                  ad.roomRequirements.stay === "both" ? "Any" : `${ad.roomRequirements.stay} term`,
                  ad.propertyType,
                  ad.roomRequirements.attachedBath ? "Yes" : "No",
                  ad.roomRequirements.accomodates,
                ].map(item => (
                  <TableCell
                    key={item}
                    className={cn(
                      "h-6 py-1 text-left font-normal capitalize text-black last:border-r-0",
                      item === ad.roomRequirements.gender && "uppercase text-primary",
                    )}
                  >
                    <div>{typeof item === "number" ? `${item} ${item === 1 ? "person" : "people"}` : item}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          {ad.description && (
            <>
              <Separator />
              <div className="flex items-center gap-1">
                <BookTextIcon className="hidden w-4 lg:inline" />
                <span className="h-8 w-full overflow-hidden text-ellipsis text-wrap md:h-auto md:text-nowrap">
                  {ad.description}
                </span>
              </div>
            </>
          )}
        </div>
        <div
          className={cn(
            "flex flex-row items-center gap-2 rounded border px-2 py-2 text-xs md:flex-col",
            isRental ? "w-full md:w-36" : "w-full md:w-[9rem]",
          )}
        >
          <span className="flex items-center gap-1">
            <AwardIcon className="w-4" />
            Amenities
          </span>
          <Separator className="hidden md:block" />
          <span className="flex grid-cols-4 gap-2 text-muted-foreground md:grid">
            {ad.roomRequirements.amenities.length > 0 ? (
              ad.roomRequirements.amenities.map(i => <AdIcon key={i} text={i} icon={getAmenitiesIcon(i)} />)
            ) : (
              <div className="col-span-4">N/A</div>
            )}
          </span>
        </div>
        {isRental && ad.gallery?.length > 0 ? (
          <Carousel
            className="mx-auto hidden w-36 md:block"
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent className="group h-24">
              {ad.gallery
                .filter(item => item.type.startsWith("image"))
                .map(item => (
                  <CarouselItem key={item.name} className="relative">
                    <Image
                      alt={item.type}
                      src={item.url}
                      width={1024}
                      height={1024}
                      priority
                      className="h-full w-full rounded bg-secondary-foreground/5 object-contain"
                      placeholder="blur"
                      blurDataURL={item.url}
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        ) : (
          isRental && <div className="hidden h-24 w-36 items-center justify-center bg-secondary md:flex">No Images</div>
        )}
      </CardContent>
      <CardFooter className="mt-0 flex flex-col justify-between gap-2 px-3 pb-2 md:border-t md:pt-2 xl:flex-row">
        <div className="ml-3 flex w-full flex-wrap items-center gap-2 md:ml-0 md:w-auto">
          <div className="flex items-center gap-1">
            <InfoIcon className="w-4" />
            <span>{isRental ? "Information :" : "Preferences :"}</span>
          </div>
          <AdIcon
            color="#a34f00"
            text={ad.roomRequirements.furnished ? "Furnished" : "Not Furnished"}
            icon={
              ad.roomRequirements.furnished ? (
                <MonitorIcon color="#a34f00" className="w-4" />
              ) : (
                <MonitorOffIcon color="#a34f00" className="w-4" />
              )
            }
          />
          {ad.roomRequirements.vegetarian !== null && (
            <AdIcon
              color="#00a303"
              icon={
                ad.roomRequirements.vegetarian === true ? (
                  <BeanIcon color="#00a303" className="w-4" />
                ) : (
                  <BeanOffIcon color="#00a303" className="w-4" />
                )
              }
              text={ad.roomRequirements.vegetarian === true ? "Vegetarian Preferred" : "No Vegetarian Preference"}
            />
          )}
          {ad.roomRequirements.petFriendly !== null && (
            <AdIcon
              color="#0031a3"
              icon={
                ad.roomRequirements.petFriendly === true ? (
                  <FishIcon color="#0031a3" className="w-4" />
                ) : (
                  <FishOffIcon color="#0031a3" className="w-4" />
                )
              }
              text={ad.roomRequirements.petFriendly ? "Pet Friendly" : "No Pets Allowed"}
            />
          )}
          {ad.roomRequirements.smoking !== null && (
            <AdIcon
              color="#7800a3"
              icon={
                ad.roomRequirements.smoking === "no" ? (
                  <CigaretteOffIcon color="#7800a3" className="w-4" />
                ) : (
                  <CigaretteIcon color="#7800a3" className="w-4" />
                )
              }
              text={`${ad.roomRequirements.smoking} smoking`}
            />
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:mt-0">
          <ShareButton
            onlyIcon
            text={`${ad.propertyType} ${isRental ? "available" : "wanted"} in ${ad.address.city}, ${ad.address.state}`.toUpperCase()}
            title="Roomie Listings"
            url={`https://www.roomielistings.com/${isRental ? "room" : "roommate"}/${ad.id}`}
            size="sm"
          />
          {currentUser?.uid === ad.postedBy ? (
            <>
              {isPending ? (
                <Button className="text-black" size="sm" variant="outline" disabled>
                  <PenLineIcon className="mr-1 w-4" />
                  Edit
                </Button>
              ) : (
                <Link href={`/${isRental ? "room" : "roommate"}/${ad?.id}/edit`}>
                  <Button className="text-black" size="sm" variant="outline">
                    <PenLineIcon className="mr-1 w-4" />
                    Edit
                  </Button>
                </Link>
              )}
              <Button size="sm" variant="destructive" disabled={isPending} onClick={() => handleDeleteAd("postedAds")}>
                <DeleteIcon className="mr-1 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              {currentUser &&
                (ad.reports.includes(currentUser!.uid) ? (
                  <AdCardInfo
                    toolTipText="Remove from reports"
                    onConfirm={isPending ? () => {} : () => handleDeleteAd("reportedAds")}
                    confirmMessage="remove this ad"
                  >
                    <Button variant="outline" size="icon" disabled={isPending}>
                      <ShieldOffIcon className="w-4 text-destructive" />
                    </Button>
                  </AdCardInfo>
                ) : (
                  <AdCardInfo
                    toolTipText="Report"
                    onConfirm={isPending ? () => {} : handleReportAd}
                    confirmMessage="report this ad"
                  >
                    <Button variant="outline" size="icon" disabled={isPending}>
                      <ShieldAlertIcon className="w-4 text-destructive" />
                    </Button>
                  </AdCardInfo>
                ))}
              {currentUser &&
                (ad.savedBy.includes(currentUser!.uid) ? (
                  <AdCardInfo
                    toolTipText="Remove from favourites"
                    onConfirm={isPending ? () => {} : () => handleDeleteAd("savedAds")}
                    confirmMessage="remove this ad"
                  >
                    <Button variant="outline" size="icon" disabled={isPending}>
                      <HeartOffIcon className="w-4 text-destructive" />
                    </Button>
                  </AdCardInfo>
                ) : (
                  <AdCardInfo
                    toolTipText="Add to favourites"
                    onConfirm={isPending ? () => {} : handleSaveAd}
                    confirmMessage="add this ad to favourites"
                  >
                    <Button variant="outline" size="icon" disabled={isPending}>
                      <HeartIcon className="w-4 text-destructive" />
                    </Button>
                  </AdCardInfo>
                ))}
            </>
          )}

          {isPending ? (
            <Button size="sm" disabled>
              <DoorOpenIcon className="mr-1 w-4" />
              View More
            </Button>
          ) : (
            <Link href={`/${isRental ? "room" : "roommate"}/${ad?.id}`}>
              <Button size="sm">
                <DoorOpenIcon className="mr-1 w-4" />
                View More
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
