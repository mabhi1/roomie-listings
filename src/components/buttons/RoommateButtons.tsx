"use client";

import { RoommateAd } from "@/lib/types";
import useAuth from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { useTransition } from "react";
import { deleteRoommateAds, reportRoommate, saveRoommate } from "@/actions/roommate";
import { toast } from "sonner";
import Link from "next/link";
import {
  BanIcon,
  CheckSquareIcon,
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

export default function RoommateButtons({ ad }: { ad: RoommateAd }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSaveAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await saveRoommate(ad.id!, currentUser.uid);
        if (data.error) toast.error(data.error);
        else toast.success(data.message);
      });
  };

  const handleReportAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await reportRoommate(ad.id!, currentUser.uid);
        if (data.error) toast.error(data.error);
        else toast.success(data.message);
      });
  };

  const handleDeleteAd = async () => {
    startTransition(async () => {
      if (!currentUser) return;
      try {
        const ads = await deleteRoommateAds(currentUser.uid, ad.id!, "postedAds");
        if (!ads) {
          toast.error("Error removing Ad");
          return;
        }
        toast.success("Ad removed successfully");
        router.push("/house");
      } catch (error) {
        toast.error("Error removing Ad");
      }
    });
  };

  if (!currentUser)
    return (
      <CardFooter className="p-3 md:p-6 justify-start md:justify-end">
        <div>Please login to save, or report this ad, or send a message to the user</div>
      </CardFooter>
    );
  else if (ad.postedBy === currentUser?.uid)
    return (
      <CardFooter className="justify-between p-3 md:p-5 gap-2 lg:gap-5">
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
              <DrawerFooter className="flex-row mx-auto">
                <Button onClick={handleDeleteAd} disabled={isPending}>
                  <CheckSquareIcon className="w-4 mr-1" />
                  Confirm
                </Button>
                <DrawerClose>
                  <Button variant="outline">
                    <BanIcon className="w-4 mr-1" />
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
                <Button onClick={handleDeleteAd} disabled={isPending}>
                  <CheckSquareIcon className="w-4 mr-1" />
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
      <CardFooter className="flex-col md:flex-row p-3 md:p-5 gap-2 lg:gap-5 justify-between">
        <div className="flex flex-row justify-between w-full md:w-fit gap-2 lg:gap-5">
          {currentUser.emailVerified && (
            <Link href={`/message/${currentUser.uid}/${ad.postedBy}/roommate/${ad.id}`} passHref legacyBehavior>
              <Button disabled={isPending}>
                <SendIcon className="w-4 mr-1" />
                Send Message
              </Button>
            </Link>
          )}
          {ad.savedBy.includes(currentUser.uid) ? (
            <div>You saved this Ad</div>
          ) : (
            <Button variant="secondary" onClick={handleSaveAd} disabled={isPending}>
              <HardDriveDownloadIcon className="w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
        {currentUser.emailVerified ? (
          <div className="flex flex-row-reverse md:flex-row items-center justify-between w-full md:w-fit md:gap-2 lg:gap-5">
            <div className="text-destructive">
              {ad.reports.length} {ad.reports.length === 1 ? "Report" : "Reports"}
            </div>
            <Button variant="destructive" disabled={isPending} onClick={handleReportAd}>
              <MessageSquareXIcon className="w-4 mr-1" />
              Report Inappropriate
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground">Please verify your email to send email or report this ad.</div>
        )}
      </CardFooter>
    );
}
