"use client";

import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import useAuth from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { toastMessage } from "@/lib/constants";
import { sendEmailVerification } from "firebase/auth";
import { BadgeCheckIcon, BadgeXIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function Profile() {
  const currentUser = useAuth();

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(currentUser!);
      toast.success(toastMessage.emailVerificationSuccess);
    } catch (error) {
      toast.error(toastMessage.emailVerificationError);
    }
  };

  if (currentUser)
    return (
      <FullWrapper className="gap-5">
        <PageHeader heading="My Profile" />
        <div className="flex gap-5">
          <div className="rounded-full w-fit h-fit overflow-clip">
            <Image
              src={currentUser.photoURL ? currentUser.photoURL : "/user.png"}
              alt={currentUser.displayName!}
              width={100}
              height={100}
              className="w-auto"
              priority
            />
          </div>
          <div className="flex flex-col justify-center gap-1 mr-auto">
            <div className="">{currentUser.displayName}</div>
            <div className="">{currentUser.email}</div>
            {currentUser.emailVerified ? (
              <span className="flex items-center gap-1 text-success">
                <BadgeCheckIcon className="w-4" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <BadgeXIcon className="w-4" />
                <span>Not Verified</span>
                <Button onClick={handleSendVerification} variant="link" className="text-xs p-0 h-0">
                  &#40;Send Verification link&#41;
                </Button>
              </span>
            )}
          </div>
          <Button>Edit Profile</Button>
        </div>
      </FullWrapper>
    );
}
