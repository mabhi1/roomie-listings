"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { socialSignIn } from "@/firebase/firebaseAuthFunctions";
import { ButtonHTMLAttributes } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/lib/types";
import axios from "axios";
import googleImage from "../../../public/google.png";

export default function GoogleButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const userMutation = useMutation({
    mutationFn: (data: User) => {
      return axios.post("/api/users", data);
    },
  });

  const handleSocialSignin = async () => {
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
        phone: user.phoneNumber,
      });
  };

  return (
    <Button
      className="mx-auto flex w-full max-w-[20rem] justify-center gap-2 p-2 px-5 md:w-[21rem] md:max-w-[21rem]"
      onClick={handleSocialSignin}
      {...props}
    >
      <Image src={googleImage} alt="Google" width={16} height={16} />
      <span>Sign in with Google</span>
    </Button>
  );
}
