"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { socialSignIn } from "@/firebase/firebaseFunctions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

export default function GoogleButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();

  const handleSocialSignin = async () => {
    try {
      await socialSignIn("google");
      router.back();
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Button className="flex gap-2 justify-center w-[21rem] mx-auto px-5 p-2" onClick={handleSocialSignin} {...props}>
      <Image src="/google.png" alt="Google" width={16} height={16} />
      <span>Sign in with Google</span>
    </Button>
  );
}
