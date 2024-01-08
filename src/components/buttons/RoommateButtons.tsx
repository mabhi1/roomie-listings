"use client";

import { RoommateAd } from "@/lib/types";
import useAuth from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { useTransition } from "react";
import { reportRoommate, saveRoommate } from "@/actions/roommate";
import { toast } from "sonner";
import Link from "next/link";

export default function RoommateButtons({ ad }: { ad: RoommateAd }) {
  const currentUser = useAuth();
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

  if (ad.postedBy === currentUser?.uid || !currentUser) return <></>;
  else
    return (
      <CardFooter className="p-5 gap-5">
        <Link href="#">
          <Button disabled={isPending}>Send Message</Button>
        </Link>
        {ad.savedBy.includes(currentUser.uid) ? (
          <div className="mr-auto">You saved this Ad</div>
        ) : (
          <Button className="mr-auto" variant="secondary" onClick={handleSaveAd} disabled={isPending}>
            Save
          </Button>
        )}
        <Button variant="destructive" disabled={isPending} onClick={handleReportAd}>
          Report Inappropriate
        </Button>
      </CardFooter>
    );
}
