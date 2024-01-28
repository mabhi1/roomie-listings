"use client";

import { updateProfilePicture } from "@/actions/user";
import ProfileButtons from "@/components/buttons/ProfileButtons";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import useAuth from "@/components/providers/AuthProvider";
import CommentProfileTable from "@/components/tables/comment/ProfileTable";
import RoomProfileTable from "@/components/tables/room/ProfileTable";
import RoommateProfileTable from "@/components/tables/roommate/ProfileTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePhoto } from "@/firebase/firebaseAuthFunctions";
import { deleteFile } from "@/firebase/firebaseDBFunctions";
import { toastMessage } from "@/lib/constants";
import { sendEmailVerification } from "firebase/auth";
import { BadgeCheckIcon, BadgeXIcon, HomeIcon, MessageSquareMoreIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import noUserImage from "../../../public/user.png";

export default function Profile() {
  const { currentUser } = useAuth();

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(currentUser!);
      toast.success(toastMessage.emailVerificationSuccess);
    } catch (error) {
      toast.error(toastMessage.emailVerificationError);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      await deleteFile(currentUser?.uid!);
      await updatePhoto("");
      await updateProfilePicture(currentUser?.uid!, null);
      toast.success("Profile picture removed successfully");
    } catch (error: any) {
      toast.error("Error in removing profile picture");
    }
  };

  if (currentUser)
    return (
      <FullWrapper className="gap-3 md:gap-5">
        <PageHeader
          heading="My Profile"
          subHeading="This is your profile page. You can see the related comments and ads here."
        />
        <div className="flex flex-col gap-3 md:flex-row md:items-center lg:gap-5">
          <div className="group relative h-fit w-fit overflow-clip rounded-full">
            <Image
              src={currentUser.photoURL ? currentUser.photoURL : noUserImage}
              alt={currentUser.displayName!}
              width={50}
              height={50}
              className="h-[80px] w-[80px] object-cover xl:h-[100px] xl:w-[100px]"
              priority
              placeholder="blur"
              blurDataURL={currentUser.photoURL ? currentUser.photoURL : ""}
            />
            {currentUser.photoURL && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-0 hidden h-7 w-full border bg-primary-foreground/80 p-2 text-xs group-hover:block"
                onClick={handleRemoveProfilePicture}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="mr-auto flex flex-col justify-center">
            <div className="text-lg">{currentUser.displayName}</div>
            <div className="w-72 overflow-hidden lg:w-80">{currentUser.email}</div>
            {currentUser.emailVerified ? (
              <span className="flex items-center gap-1 text-success">
                <BadgeCheckIcon className="w-4" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <BadgeXIcon className="w-4" />
                <span>Not Verified</span>
                <Button onClick={handleSendVerification} variant="link" className="h-0 p-0 text-xs">
                  &#40;Send Verification link&#41;
                </Button>
              </span>
            )}
          </div>
          <ProfileButtons currentUser={currentUser} />
        </div>
        <Tabs defaultValue="savedAds" className="mt-5 w-full md:mt-0">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="savedAds">Saved Ads</TabsTrigger>
            <TabsTrigger value="postedAds">Posted Ads</TabsTrigger>
            {/* <TabsTrigger value="comments">Comments</TabsTrigger> */}
            <TabsTrigger value="reportedAds">Reported Ads</TabsTrigger>
            {/* <TabsTrigger value="reportedComments">Reported Comments</TabsTrigger> */}
          </TabsList>

          <TabsContent value="savedAds" className="mt-0 flex flex-col gap-2">
            <div className="mt-2 flex items-center">
              <HomeIcon className="mr-1 w-4" />
              Saved Room Ads
            </div>
            <RoomProfileTable currentUser={currentUser} tab="savedAds" />
            <div className="flex items-center">
              <UsersIcon className="mr-1 w-4" />
              Saved Roommate Ads
            </div>
            <RoommateProfileTable currentUser={currentUser} tab="savedAds" />
          </TabsContent>
          <TabsContent value="postedAds" className="mt-0 flex flex-col gap-2">
            <div className="mt-2 flex items-center">
              <HomeIcon className="mr-1 w-4" />
              Posted Room Ads
            </div>
            <RoomProfileTable currentUser={currentUser} tab="postedAds" />
            <div className="flex items-center">
              <UsersIcon className="mr-1 w-4" />
              Posted Roommate Ads
            </div>
            <RoommateProfileTable currentUser={currentUser} tab="postedAds" />
          </TabsContent>
          {/* <TabsContent value="comments" className="mt-0 flex flex-col gap-2">
            <div className="mt-2 flex items-center">
              <MessageSquareMoreIcon className="mr-1 w-4" />
              Posted Comments
            </div>
            <CommentProfileTable currentUser={currentUser} tab="comments" />
          </TabsContent> */}
          <TabsContent value="reportedAds" className="mt-0 flex flex-col gap-2">
            <div className="mt-2 flex items-center">
              <HomeIcon className="mr-1 w-4" />
              Reported Room Ads
            </div>
            <RoomProfileTable currentUser={currentUser} tab="reportedAds" />
            <div className="flex items-center">
              <UsersIcon className="mr-1 w-4" />
              Reported Roommate Ads
            </div>
            <RoommateProfileTable currentUser={currentUser} tab="reportedAds" />
          </TabsContent>
          {/* <TabsContent value="reportedComments" className="mt-0 flex flex-col gap-2">
            <div className="mt-2 flex items-center">
              <MessageSquareMoreIcon className="mr-1 w-4" />
              Reported Comments
            </div>
            <CommentProfileTable currentUser={currentUser} tab="reportedComments" />
          </TabsContent> */}
        </Tabs>
      </FullWrapper>
    );
}
