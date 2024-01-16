"use client";

import { dosignOut } from "@/firebase/firebaseAuthFunctions";
import { Button } from "../ui/button";
import useAuth from "../providers/AuthProvider";
import { UserXIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export default function SignoutButton({ variant, className }: { variant: Variant; className?: string }) {
  const currentUser = useAuth();

  const handleSignout = async () => {
    try {
      await dosignOut();
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  if (currentUser)
    return (
      <Button variant={variant} onClick={handleSignout} className={cn("focus-visible:ring-0", className)}>
        <UserXIcon className="mr-1 w-4" />
        Sign out
      </Button>
    );
}
