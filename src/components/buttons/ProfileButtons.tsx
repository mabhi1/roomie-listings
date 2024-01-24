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

export default function ProfileButtons({ currentUser }: { currentUser: User }) {
  console.log(currentUser);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const getProvider = useMemo(() => {
    return currentUser.providerData[0].providerId;
  }, [currentUser]);

  const provider = currentUser.providerData[0].providerId;

  return (
    <div
      className={cn(
        "grid gap-3 xl:gap-5 justify-end items-center",
        provider === "password" ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-2 xl:grid-cols-3"
      )}
    >
      <Link href={`/user/${currentUser.uid}`} passHref legacyBehavior>
        <Button variant="secondary">
          <ContactIcon className="w-4 mr-1" /> Public Profile
        </Button>
      </Link>
      {getProvider === "password" && (
        <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={() => setPasswordDialog(true)}>
              <SquareAsteriskIcon className="w-4 mr-1" />
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
      <Link href={`/profile/messages/${currentUser.uid}`} passHref legacyBehavior>
        <Button variant="secondary">
          <MessageSquareMoreIcon className="w-4 mr-1" />
          Messages
        </Button>
      </Link>
      <Dialog open={profileDialog} onOpenChange={setProfileDialog}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setProfileDialog(true)}
            className={provider !== "password" ? "col-start-2 xl:col-start-auto" : ""}
          >
            <UserCog2Icon className="w-4 mr-1" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Edit your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <EditProfileForm currentUser={currentUser} setDialog={setProfileDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
