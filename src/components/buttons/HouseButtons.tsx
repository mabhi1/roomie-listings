"use client";

import useAuth from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { HouseAd } from "@/lib/types";
import { reporthouse, savehouse } from "@/actions/house";

export default function HouseButtons({ ad }: { ad: HouseAd }) {
  const currentUser = useAuth();
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

  if (!currentUser) return <></>;
  else if (ad.postedBy === currentUser?.uid)
    return (
      <CardFooter className="p-5 gap-5">
        <Link href={`/house/${ad.id}/edit`}>
          <Button variant="secondary" disabled={isPending}>
            Edit
          </Button>
        </Link>
      </CardFooter>
    );
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
