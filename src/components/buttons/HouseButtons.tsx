"use client";

import useAuth from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { HouseAd } from "@/lib/types";
import { deleteHouseAds, reporthouse, savehouse } from "@/actions/house";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { deleteFile } from "@/firebase/firebaseDBFunctions";
import {
  CheckSquareIcon,
  DeleteIcon,
  HardDriveDownloadIcon,
  MessageSquareXIcon,
  PenLineIcon,
  SendIcon,
} from "lucide-react";

export default function HouseButtons({ ad }: { ad: HouseAd }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSaveAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await savehouse(ad.id!, currentUser.uid);
        if (data.error) toast.error(data.error);
        else toast.success(data.message);
      });
  };

  const handleReportAd = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await reporthouse(ad.id!, currentUser.uid);
        if (data.error) toast.error(data.error);
        else toast.success(data.message);
      });
  };

  const handleDeleteAd = async () => {
    startTransition(async () => {
      if (!currentUser) return;
      try {
        ad.gallery.map(async (item) => {
          await deleteFile(item.name);
        });
        const ads = await deleteHouseAds(currentUser.uid, ad.id!, "postedAds");
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
      <CardFooter className="justify-end">
        <div>Please login to save, or report this ad, or send a message to the user</div>
      </CardFooter>
    );
  else if (ad.postedBy === currentUser?.uid)
    return (
      <CardFooter className="p-5 gap-2 lg:gap-5 justify-between">
        <Link href={`/house/${ad.id}/edit`} passHref legacyBehavior>
          <Button variant="secondary" disabled={isPending}>
            <PenLineIcon className="mr-1 w-4" />
            Edit
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger>
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
      </CardFooter>
    );
  else
    return (
      <CardFooter className="p-5 gap-2 lg:gap-5">
        {currentUser.emailVerified && (
          <Link href={`/message/${currentUser.uid}/${ad.postedBy}/house/${ad.id}`} passHref legacyBehavior>
            <Button disabled={isPending}>
              <SendIcon className="w-4 mr-1" />
              Send Message
            </Button>
          </Link>
        )}
        {ad.savedBy.includes(currentUser.uid) ? (
          <div className="mr-auto">You saved this Ad</div>
        ) : (
          <Button className="mr-auto" variant="secondary" onClick={handleSaveAd} disabled={isPending}>
            <HardDriveDownloadIcon className="w-4 mr-1" />
            Save
          </Button>
        )}
        {currentUser.emailVerified ? (
          <>
            <div className="text-destructive">
              {ad.reports.length} {ad.reports.length === 1 ? "Report" : "Reports"}
            </div>
            <Button variant="destructive" disabled={isPending} onClick={handleReportAd}>
              <MessageSquareXIcon className="w-4 mr-1" />
              Report Inappropriate
            </Button>
          </>
        ) : (
          <div className="text-muted-foreground">Please verify your email to send email or report this ad.</div>
        )}
      </CardFooter>
    );
}
