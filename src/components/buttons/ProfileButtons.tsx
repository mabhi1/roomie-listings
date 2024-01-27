"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { User } from "firebase/auth";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import EditProfileForm from "../forms/EditProfileForm";
import Link from "next/link";
import { ContactIcon, MessageSquareMoreIcon, SquareAsteriskIcon, UserCog2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";

export default function ProfileButtons({ currentUser }: { currentUser: User }) {
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const getProvider = useMemo(() => {
    return currentUser.providerData[0].providerId;
  }, [currentUser]);

  const provider = currentUser.providerData[0].providerId;

  return (
    <div
      className={cn(
        "grid items-center justify-end gap-3 xl:gap-5",
        provider === "password" ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-2 xl:grid-cols-3",
      )}
    >
      <Link href={`/user/${currentUser.uid}`} passHref legacyBehavior>
        <Button variant="secondary">
          <ContactIcon className="mr-1 w-4" /> Public Profile
        </Button>
      </Link>
      {getProvider === "password" && (
        <>
          {isMobile ? (
            <Drawer open={passwordDialog} onOpenChange={setPasswordDialog}>
              <DrawerTrigger asChild>
                <Button variant="secondary" onClick={() => setPasswordDialog(true)}>
                  <SquareAsteriskIcon className="mr-1 w-4" />
                  Change Password
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Change Password</DrawerTitle>
                  <DrawerDescription>Change your password here. Click save when you&apos;re done.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <ChangePasswordForm currentUser={currentUser} setDialog={setPasswordDialog} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" onClick={() => setPasswordDialog(true)}>
                  <SquareAsteriskIcon className="mr-1 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>Change your password here. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>
                <ChangePasswordForm currentUser={currentUser} setDialog={setPasswordDialog} />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
      <Link href={`/profile/messages/${currentUser.uid}`} passHref legacyBehavior>
        <Button variant="secondary">
          <MessageSquareMoreIcon className="mr-1 w-4" />
          Messages
        </Button>
      </Link>
      {isMobile ? (
        <Drawer open={profileDialog} onOpenChange={setProfileDialog}>
          <DrawerTrigger asChild>
            <Button
              onClick={() => setProfileDialog(true)}
              className={cn(provider !== "password" ? "md:col-start-2 xl:col-start-auto" : "")}
            >
              <UserCog2Icon className="mr-1 w-4" />
              Edit Profile
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Profile</DrawerTitle>
              <DrawerDescription>Edit your profile here. Click save when you&apos;re done.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <EditProfileForm currentUser={currentUser} setDialog={setProfileDialog} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={profileDialog} onOpenChange={setProfileDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setProfileDialog(true)}
              className={cn(provider !== "password" ? "md:col-start-2 xl:col-start-auto" : "")}
            >
              <UserCog2Icon className="mr-1 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[350px] md:max-w-[520px]">
            <DialogHeader className="text-left">
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Edit your profile here. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>
            <EditProfileForm currentUser={currentUser} setDialog={setProfileDialog} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
