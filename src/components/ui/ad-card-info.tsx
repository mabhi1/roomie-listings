"use client";

import { Button } from "@/components/ui/button";
import { BanIcon, CheckSquareIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { useState } from "react";

export default function AdCardInfo({
  children,
  toolTipText,
  onConfirm,
  confirmMessage,
}: {
  children: React.ReactNode;
  toolTipText: string;
  onConfirm: () => void;
  confirmMessage: string;
}) {
  const [open, setOpen] = useState(false);

  const getTooltip = () => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent className="bg-muted-foreground capitalize text-muted">
            <p>{toolTipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm Action</DrawerTitle>
            <DrawerDescription>Are you sure you want to {confirmMessage} ?</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="mx-auto flex-row">
            <Button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
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
    );
  else
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>{getTooltip()}</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Are you sure you want to {confirmMessage} ?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              <CheckSquareIcon className="mr-1 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
