import { deleteHouseAds, getHouseAds } from "@/actions/house";
import Spinner from "@/components/page/Spinner";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HouseAd } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckSquareIcon, PenBoxIcon, XCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gallery } from "@prisma/client";
import { deleteFile } from "@/firebase/firebaseDBFunctions";

export default function HouseProfileTable({ currentUser, tab }: { currentUser: User; tab: string }) {
  const [ads, setAds] = useState<HouseAd[] | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAds() {
      const ads = await getHouseAds(currentUser.uid, tab);
      setAds(ads);
      setLoading(false);
    }
    getAds();
  }, [currentUser.uid, tab]);

  const handleDeleteAd = async (adId: string, gallery: Gallery[]) => {
    setLoading(true);
    try {
      gallery.map(async (item) => {
        await deleteFile(item.name);
      });
      const ads = await deleteHouseAds(currentUser.uid, adId, tab);
      if (!ads) {
        toast.error("Error removing Ad");
        return;
      }
      setAds((ads) => ads?.filter((ad) => ad.id !== adId));
      setLoading(false);
      toast.success("Ad removed successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Error removing Ad");
    }
  };

  if (loading)
    return (
      <div className="w-full mt-10 flex justify-center">
        <Spinner size="medium" />
      </div>
    );
  else if (!ads || ads.length === 0) return <div className="w-full flex justify-center">No House Ads</div>;
  else
    return (
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="border-r font-normal text-accent-foreground h-8">Title</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Location</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Price</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Available</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Duration</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Reports</TableHead>
            <TableHead className="text-center font-normal text-accent-foreground h-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads?.map((house) => (
            <TableRow className="hover:bg-inherit" key={house.id}>
              <TableCell className="border-r py-1 pl-4">
                <Link href={`/house/${house.id}`} className="block w-[580px] overflow-hidden">
                  <Button variant="link" className="p-0">
                    {house.title}
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="border-r text-center py-1">{`${house.address.city}, ${house.address.state}`}</TableCell>
              <TableCell className="border-r text-center py-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(house.price)}
              </TableCell>
              <TableCell className="border-r text-center py-1">
                {house.available.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </TableCell>
              <TableCell className="border-r text-center capitalize py-1">{house.duration}</TableCell>
              <TableCell className="border-r text-center capitalize py-1">{house.reports.length}</TableCell>
              <TableCell className="text-center capitalize py-1">
                <div className="flex justify-center">
                  {tab === "postedAds" && (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link href={`/house/${house.id}/edit`}>
                            <PenBoxIcon className="mx-auto text-success cursor-pointer mr-2 w-5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Dialog>
                    <DialogTrigger>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <XCircleIcon className="mx-auto text-destructive cursor-pointer w-5" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this ad?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button onClick={() => handleDeleteAd(house.id!, house.gallery)}>
                          <CheckSquareIcon className="w-4 mr-1" />
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
