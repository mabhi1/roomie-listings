"use client";

import { updateProfilePicture } from "@/actions/user";
import ProfileButtons from "@/components/buttons/ProfileButtons";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import useAuth from "@/components/providers/AuthProvider";
import CommentProfileTable from "@/components/tables/comment/ProfileTable";
import HouseProfileTable from "@/components/tables/house/ProfileTable";
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
        <div className="flex flex-col md:flex-row gap-3 lg:gap-5 md:items-center">
          <div className="group relative rounded-full w-fit h-fit overflow-clip">
            <Image
              src={currentUser.photoURL ? currentUser.photoURL : noUserImage}
              alt={currentUser.displayName!}
              width={50}
              height={50}
              className="w-[80px] h-[80px] xl:w-[100px] xl:h-[100px] object-cover"
              priority
              placeholder="blur"
              blurDataURL={currentUser.photoURL ? currentUser.photoURL : ""}
            />
            {currentUser.photoURL && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden group-hover:block absolute text-xs top-0 bg-primary-foreground/80 p-2 h-7 w-full border"
                onClick={handleRemoveProfilePicture}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="flex flex-col justify-center mr-auto">
            <div className="text-lg">{currentUser.displayName}</div>
            <div className="w-72 lg:w-80 overflow-hidden">{currentUser.email}</div>
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
          <ProfileButtons currentUser={currentUser} />
        </div>
        <Tabs defaultValue="savedAds" className="w-full mt-5 md:mt-0">
          <TabsList className="flex-wrap md:flex-nowrap h-16 overflow-y-auto md:h-10 w-full">
            <TabsTrigger value="savedAds">Saved Ads</TabsTrigger>
            <TabsTrigger value="postedAds">Posted Ads</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="reportedAds">Reported Ads</TabsTrigger>
            <TabsTrigger value="reportedComments">Reported Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="savedAds" className="flex flex-col gap-2 mt-0">
            <div className="flex items-center mt-2">
              <HomeIcon className="mr-1 w-4" />
              Saved House Ads
            </div>
            <HouseProfileTable currentUser={currentUser} tab="savedAds" />
            <div className="flex items-center">
              <UsersIcon className="mr-1 w-4" />
              Saved Roommate Ads
            </div>
            <RoommateProfileTable currentUser={currentUser} tab="savedAds" />
          </TabsContent>
          <TabsContent value="postedAds" className="flex flex-col gap-2 mt-0">
            <div className="flex items-center mt-2">
              <HomeIcon className="mr-1 w-4" />
              Posted House Ads
            </div>
            <HouseProfileTable currentUser={currentUser} tab="postedAds" />
            <div className="flex items-center">
              <UsersIcon className="mr-1 w-4" />
              Posted Roommate Ads
            </div>
            <RoommateProfileTable currentUser={currentUser} tab="postedAds" />
          </TabsContent>
          <TabsContent value="comments" className="flex flex-col gap-2 mt-0">
            <div className="flex items-center mt-2">
              <MessageSquareMoreIcon className="mr-1 w-4" />
              Posted Comments
            </div>
            <CommentProfileTable currentUser={currentUser} tab="comments" />
          </TabsContent>
          <TabsContent value="reportedAds" className="flex flex-col gap-2 mt-0">
            <div className="flex items-center mt-2">
              <HomeIcon className="mr-1 w-4" />
              Reported House Ads
            </div>
            <HouseProfileTable currentUser={currentUser} tab="reportedAds" />
            <div className="flex items-center">
              <UsersIcon className="mr-1 w-4" />
              Reported Roommate Ads
            </div>
            <RoommateProfileTable currentUser={currentUser} tab="reportedAds" />
          </TabsContent>
          <TabsContent value="reportedComments" className="flex flex-col gap-2 mt-0">
            <div className="flex items-center mt-2">
              <MessageSquareMoreIcon className="mr-1 w-4" />
              Reported Comments
            </div>
            <CommentProfileTable currentUser={currentUser} tab="reportedComments" />
          </TabsContent>
        </Tabs>
      </FullWrapper>
    );
}
