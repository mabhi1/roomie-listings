import { deleteRoommateAds, getRoommateAds } from "@/actions/roommate";
import Spinner from "@/components/page/Spinner";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoommateAd } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BanIcon, CheckSquareIcon, PenBoxIcon, XCircleIcon } from "lucide-react";
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
import { isMobile } from "react-device-detect";

export default function RoommateProfileTable({ currentUser, tab }: { currentUser: User; tab: string }) {
  const [ads, setAds] = useState<RoommateAd[] | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAds() {
      const ads = await getRoommateAds(currentUser.uid, tab);
      setAds(ads);
      setLoading(false);
    }
    getAds();
  }, [currentUser.uid, tab]);

  const handleDeleteAd = async (adId: string) => {
    setLoading(true);
    const ads = await deleteRoommateAds(currentUser.uid, adId, tab);
    if (!ads) {
      toast.error("Error removing Ad");
      return;
    }
    setAds(ads => ads?.filter(ad => ad.id !== adId));
    setLoading(false);
    toast.success("Ad removed successfully");
  };

  if (loading)
    return (
      <div className="mt-10 flex w-full justify-center">
        <Spinner size="medium" />
      </div>
    );
  else if (!ads || ads.length === 0) return <div className="flex w-full justify-center">No Roommate Ads</div>;
  else
    return (
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-8 border-r font-normal text-accent-foreground">Title</TableHead>
            <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">City</TableHead>
            <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Budget</TableHead>
            <TableHead className="hidden h-8 border-r text-center font-normal text-accent-foreground lg:table-cell">
              Move in
            </TableHead>
            <TableHead className="hidden h-8 border-r text-center font-normal text-accent-foreground lg:table-cell">
              Stay
            </TableHead>
            <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Reports</TableHead>
            <TableHead className="h-8 text-center font-normal text-accent-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads?.map(roommate => (
            <TableRow className="hover:bg-inherit" key={roommate.id}>
              <TableCell className="border-r py-1 pl-4">
                <Link
                  href={`/roommate/${roommate.id}`}
                  className="block w-[260px] overflow-hidden md:w-[320px] xl:w-[580px]"
                >
                  <Button variant="link" className="p-0">
                    {roommate.title}
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="border-r py-1 text-center">{roommate.address.city}</TableCell>
              <TableCell className="border-r py-1 text-center">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(roommate.budget)}
              </TableCell>
              <TableCell className="hidden border-r py-1 text-center lg:table-cell">
                {roommate.moveIn.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </TableCell>
              <TableCell className="hidden border-r py-1 text-center capitalize lg:table-cell">
                {roommate.stay}
              </TableCell>
              <TableCell className="border-r py-1 text-center capitalize">{roommate.reports.length}</TableCell>
              <TableCell className="py-1 text-center capitalize">
                <div className="flex justify-center">
                  {tab === "postedAds" && (
                    <TooltipProvider>
                      <Tooltip delayStay={0}>
                        <TooltipTrigger asChild>
                          <Link href={`/roommate/${roommate.id}/edit`}>
                            <PenBoxIcon className="mx-auto mr-2 w-5 cursor-pointer text-success" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {isMobile ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <XCircleIcon className="mx-auto w-5 cursor-pointer text-destructive" />
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Confirm Delete</DrawerTitle>
                          <DrawerDescription>Are you sure you want to delete this ad?</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter className="mx-auto flex-row">
                          <Button onClick={() => handleDeleteAd(roommate.id!)}>
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
                      <DialogTrigger>
                        <TooltipProvider>
                          <Tooltip delayStay={0}>
                            <TooltipTrigger asChild>
                              <XCircleIcon className="mx-auto w-5 cursor-pointer text-destructive" />
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
                          <Button onClick={() => handleDeleteAd(roommate.id!)}>
                            <CheckSquareIcon className="mr-1 w-4" />
                            Confirm
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
