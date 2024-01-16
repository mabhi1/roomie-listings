"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { User } from "firebase/auth";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import EditProfileForm from "../forms/EditProfileForm";

export default function ProfileButtons({ currentUser }: { currentUser: User }) {
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const getProvider = useMemo(() => {
    return currentUser.providerData[0].providerId;
  }, [currentUser]);

  return (
    <>
      {getProvider === "password" && (
        <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={() => setPasswordDialog(true)}>
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>Change your password here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <ChangePasswordForm currentUser={currentUser} setDialog={setPasswordDialog} />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={profileDialog} onOpenChange={setProfileDialog}>
        <DialogTrigger asChild>
          <Button onClick={() => setProfileDialog(true)}>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Edit your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <EditProfileForm currentUser={currentUser} setDialog={setProfileDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
