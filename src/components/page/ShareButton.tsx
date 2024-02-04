"use client";

import { RWebShare } from "react-web-share";
import { Button } from "../ui/button";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({
  url,
  text,
  title,
  onlyIcon,
  size,
}: {
  url: string;
  text: string;
  title: string;
  onlyIcon: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}) {
  return (
    <RWebShare
      data={{
        text,
        url,
        title,
      }}
      onClick={(site: string) => {
        if (site === "copy") toast.success("Link Copied");
        else toast.success("Ad Shared");
      }}
    >
      <Button size={onlyIcon ? "icon" : size ? size : "default"} variant={onlyIcon ? "outline" : "secondary"}>
        <Share2Icon className="mr-1 w-4" />
        {!onlyIcon && "Share"}
      </Button>
    </RWebShare>
  );
}
