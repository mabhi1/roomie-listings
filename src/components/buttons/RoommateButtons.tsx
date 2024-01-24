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
import { useRouter } from "next/navigation";

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

  if (!currentUser) return <></>;
  else if (ad.postedBy === currentUser?.uid)
    return (
      <CardFooter className="p-5 gap-5">
        <Link href={`/roommate/${ad.id}/edit`}>
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
      <CardFooter className="p-5 gap-5">
        {currentUser.emailVerified && (
          <Link href={`/message/${currentUser.uid}/${ad.postedBy}/roommate/${ad.id}`}>
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
