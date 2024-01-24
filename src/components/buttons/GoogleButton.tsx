"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { socialSignIn } from "@/firebase/firebaseAuthFunctions";
import { toast } from "sonner";
import { ButtonHTMLAttributes } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/lib/types";
import axios from "axios";

export default function GoogleButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const userMutation = useMutation({
    mutationFn: (data: User) => {
      return axios.post("/api/users", data);
    },
  });

  const handleSocialSignin = async () => {
    try {
      const user = await socialSignIn("google");
      if (!user) return;
      const { data } = await axios.get(`/api/users?uid=${user.uid}`);
      if (!data.data)
        userMutation.mutate({
          uid: user.uid,
          email: user.email!,
          provider: "google",
          name: user.displayName!,
          photo: user.photoURL,
        });
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Button
      className="flex gap-2 justify-center w-[19rem] md:w-[21rem] mx-auto px-5 p-2"
      onClick={handleSocialSignin}
      {...props}
    >
      <Image src="/google.png" alt="Google" width={16} height={16} />
      <span>Sign in with Google</span>
    </Button>
  );
}
