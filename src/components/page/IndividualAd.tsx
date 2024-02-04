"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import {
  AwardIcon,
  BookTextIcon,
  CoinsIcon,
  DeleteIcon,
  DoorOpenIcon,
  HeartIcon,
  HeartOffIcon,
  InfoIcon,
  MapPinIcon,
  PenLineIcon,
  ShieldAlertIcon,
  ShieldOffIcon,
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

  return (
    <Card
      className={cn(
        currentUser?.uid === ad.postedBy && list
          ? "relative border-green-600"
          : viewed && list
            ? "relative border-yellow-600"
            : "",
      )}
    >
      <CardHeader className="rounded-t bg-primary/5 px-3 py-2">
        <CardTitle className="flex flex-col-reverse items-center gap-1 text-xs font-normal md:text-sm lg:flex-row lg:text-base">
          <div className="hidden items-center gap-1 lg:flex">
            <MapPinIcon className="w-4" />
            {ad.address.city}, {ad.address.state}
            <div>|</div>
          </div>
          <div className="w-full overflow-hidden text-ellipsis text-nowrap lg:w-[25rem] xl:w-[44rem]">{ad.title}</div>
          <Separator className="lg:hidden" />
          <div className="flex w-full gap-1 lg:ml-auto lg:w-fit">
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
            <div className="mr-auto flex items-center md:gap-1 lg:hidden">
              <MapPinIcon className="w-3 md:w-4" />
              {ad.address.city}, {ad.address.state}
            </div>
            <div className="hidden gap-1 lg:flex">
              Updated: {ad.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              <div>|</div>
            </div>
            <div className="flex items-center gap-1">
              <CoinsIcon className="w-3 md:w-4" />
              Rent: ${ad.rent} {ad.roomRequirements.rentType}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-3 md:flex-row">
        <div className="flex flex-1 flex-col justify-between gap-2 overflow-auto">
          <Table>
            <TableHeader className="[&_tr]:border-b-0">
              <TableRow className="px-0">
                {[
                  "Accomodates",
                  isRental ? "Available from" : "Move in",
                  "Type",
                  "Gender",
                  "Stay type",
                  "Attached Bath",
                ].map(item => (
                  <TableHead
                    key={item}
                    className="h-7 bg-primary/5 px-2 text-left font-normal text-black first:rounded-l last:rounded-r last:border-r-0"
                  >
                    <div className="min-w-20 md:min-w-24">{item}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="px-0">
                {[
                  ad.roomRequirements.accomodates,
                  ad.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" }),
                  ad.propertyType,
                  ad.roomRequirements.gender,
                  ad.roomRequirements.stay === "both" ? "Any" : `${ad.roomRequirements.stay} term`,
                  ad.roomRequirements.attachedBath ? "Yes" : "No",
                ].map(item => (
                  <TableCell
                    key={item}
                    className={cn(
                      "h-6 p-1 px-2 text-left capitalize last:border-r-0",
                      item === ad.roomRequirements.gender && "uppercase text-primary",
                    )}
                  >
                    <div className={item === ad.roomRequirements.accomodates ? "w-20 text-right" : ""}>{item}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          {ad.description && (
            <>
              <Separator />
              <div className="flex items-center gap-1">
                <BookTextIcon className="hidden w-3 lg:inline" />
                <span className="h-8 w-full overflow-hidden text-ellipsis text-wrap md:h-auto md:text-nowrap">
                  {ad.description}
                </span>
              </div>
            </>
          )}
        </div>
        <div
          className={cn(
            "hidden flex-col items-center rounded border px-2 py-1 text-xs md:flex md:py-0",
            isRental ? "w-full md:w-36" : "w-full md:w-44",
          )}
        >
          <span className="flex items-center">
            <AwardIcon className="w-3" />
            Amenities {!isRental && "Preferred"}
          </span>
          <Separator />
          <span className="mt-1 text-wrap text-center capitalize">
            {ad.roomRequirements.amenities.length > 0
              ? ad.roomRequirements.amenities.map(i => i.split(" ").join("-")).join(", ")
              : "N/A"}
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
        <div className="hidden w-full flex-wrap items-center md:flex md:w-auto">
          <InfoIcon className="mr-1 hidden w-3 md:inline" />
          <span className="mr-1 hidden md:inline">{isRental ? "Additional Info :" : "Additional Preferences :"}</span>
          <span>{ad.roomRequirements.furnished ? "Furnished" : "Not Furnished"}</span>
          {ad.roomRequirements.vegetarian && <span>, Vegetarian Preferred</span>}
          {ad.roomRequirements.petFriendly && <span>, Pet Friendly</span>}
          {ad.roomRequirements.smoking && (
            <span className="capitalize">
              {ad.roomRequirements.smoking === "no"
                ? ", Smoking not allowed"
                : `, Smoking ${ad.roomRequirements.smoking}`}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ShareButton
            onlyIcon
            text={`${ad.propertyType} available in ${ad.address.city}, ${ad.address.state}`.toUpperCase()}
            title="Roomie Listings"
            url={`https://www.roomielistings.com/${isRental ? "room" : "roommate"}/${ad.id}`}
            size="sm"
          />
          {currentUser?.uid === ad.postedBy ? (
            <>
              {isPending ? (
                <Button size="sm" variant="secondary" disabled>
                  <PenLineIcon className="mr-1 w-4" />
                  Edit
                </Button>
              ) : (
                <Link href={`/${isRental ? "room" : "roommate"}/${ad?.id}/edit`}>
                  <Button size="sm" variant="secondary">
                    <PenLineIcon className="mr-1 w-4" />
                    Edit
                  </Button>
                </Link>
              )}
              <AdCardInfo
                toolTipText="Delete Ad"
                onConfirm={isPending ? () => {} : () => handleDeleteAd("postedAds")}
                confirmMessage="remove this ad"
              >
                <Button size="sm" variant="destructive" disabled={isPending}>
                  <DeleteIcon className="mr-1 w-4" />
                  Delete
                </Button>
              </AdCardInfo>
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
