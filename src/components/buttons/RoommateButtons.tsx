"use client";

import { RoommateAd, User } from "@/lib/types";
import useAuth from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { useEffect, useTransition } from "react";
import { deleteRoommateAds, reportRoommate, saveRoommate } from "@/actions/roommate";
import { toast } from "sonner";
import Link from "next/link";
import {
  BanIcon,
  CheckSquareIcon,
  CircleOffIcon,
  DeleteIcon,
  HardDriveDownloadIcon,
  MessageSquareXIcon,
  PenLineIcon,
  SendIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";
import MessageForm from "../forms/MessageForm";

export default function RoommateButtons({ ad, receiver }: { ad: RoommateAd; receiver: User }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const visitedAds = sessionStorage.getItem("roomie_listings_visited_ads");
    if (!visitedAds) sessionStorage.setItem("roomie_listings_visited_ads", JSON.stringify([ad.id]));
    else sessionStorage.setItem("roomie_listings_visited_ads", JSON.stringify([...JSON.parse(visitedAds), ad.id]));
  }, [ad.id]);

  const handleSaveAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await saveRoommate(ad.id!, currentUser.uid);
        if (!data) toast.error("Error adding this ad to favourites");
        else toast.success("Ad added to favourites");
      });
  };

  const handleReportAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await reportRoommate(ad.id!, currentUser.uid);
        if (!data) toast.error("Error reporting ad");
        else toast.success("Ad reported successfully");
      });
  };

  const handleDeleteAd = async (tab: "reportedAds" | "savedAds" | "postedAds") => {
    startTransition(async () => {
      if (!currentUser) return;
      try {
        const ads = await deleteRoommateAds(currentUser.uid, ad.id!, tab);
        if (!ads) {
          toast.error("Error removing Ad");
          return;
        }
        toast.success("Ad removed successfully");
        if (tab == "postedAds") router.push("/room");
      } catch (error) {
        toast.error("Error removing Ad");
      }
    });
  };

  if (!currentUser)
    return (
      <CardFooter className="justify-start p-3 md:p-4">
        <Link href={`/signin?fallbackUrl=/roommate/${ad.id}`} legacyBehavior passHref>
          <Button disabled={isPending}>
            <SendIcon className="mr-1 w-4" />
            Send Message
          </Button>
        </Link>
      </CardFooter>
    );
  else if (ad.postedBy === currentUser?.uid)
    return (
      <CardFooter className="justify-between gap-2 p-3 md:p-5 lg:gap-5">
        <Link href={`/roommate/${ad.id}/edit`} passHref legacyBehavior>
          <Button variant="secondary" disabled={isPending}>
            <PenLineIcon className="mr-1 w-4" />
            Edit
          </Button>
        </Link>
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                <DeleteIcon className="mr-1 w-4" />
                Delete
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Confirm Delete</DrawerTitle>
                <DrawerDescription>Are you sure you want to delete this ad?</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="mx-auto flex-row">
                <Button onClick={() => handleDeleteAd("postedAds")} disabled={isPending}>
                  <CheckSquareIcon className="mr-1 w-4" />
                  Confirm
                </Button>
                <DrawerClose>
                  <Button variant="outline">
                    <BanIcon className="mr-1 w-4" />
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                <DeleteIcon className="mr-1 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>Are you sure you want to delete this ad?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => handleDeleteAd("postedAds")} disabled={isPending}>
                  <CheckSquareIcon className="mr-1 w-4" />
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    );
  else
    return (
      <CardFooter className="flex-col justify-between gap-2 p-3 md:flex-row md:p-5 lg:gap-5">
        <div className="flex w-full flex-col justify-between gap-2 md:w-fit md:flex-row lg:gap-5">
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button disabled={isPending}>
                  <SendIcon className="mr-1 w-4" />
                  Send Message
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-5">
                <MessageForm ad={ad} receiver={receiver} type="roommate" currentUserId={currentUser.uid} />
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={isPending}>
                  <SendIcon className="mr-1 w-4" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <MessageForm ad={ad} receiver={receiver} type="roommate" currentUserId={currentUser.uid} />
              </DialogContent>
            </Dialog>
          )}
          {ad.savedBy.includes(currentUser.uid) ? (
            <Button variant="secondary" onClick={() => handleDeleteAd("savedAds")} disabled={isPending}>
              <CircleOffIcon className="mr-1 w-4" />
              Remove from Favourites
            </Button>
          ) : (
            <Button
              onClick={handleSaveAd}
              disabled={isPending}
              className="bg-success text-success-foreground hover:bg-success/80"
            >
              <HardDriveDownloadIcon className="mr-1 w-4" />
              Add to Favourites
            </Button>
          )}
        </div>

        <div className="mb-2 flex w-full flex-row items-center justify-between md:mb-0 md:w-fit md:gap-2 lg:gap-5">
          <div className="ml-2 text-destructive md:ml-0">
            {ad.reports.length} {ad.reports.length === 1 ? "Report" : "Reports"}
          </div>
          {ad.reports.includes(currentUser.uid) ? (
            <Button disabled={isPending} onClick={() => handleDeleteAd("reportedAds")} variant="secondary">
              <CircleOffIcon className="mr-1 w-4" />
              Remove from Reported
            </Button>
          ) : (
            <Button variant="destructive" disabled={isPending} onClick={handleReportAd}>
              <MessageSquareXIcon className="mr-1 w-4" />
              Report Inappropriate
            </Button>
          )}
        </div>
      </CardFooter>
    );
}
