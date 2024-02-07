"use client";

import { RotateCcwIcon, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { RoomAd, RoommateAd } from "@/lib/types";
import Required from "./Required";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { sendEmail } from "@/actions/message";
import { uploadFile } from "@/firebase/firebaseDBFunctions";
import { getUser } from "@/actions/user";
import { User } from "@prisma/client";

export default function MessageForm({
  currentUserId,
  receiver,
  type,
  ad,
}: {
  currentUserId: string;
  receiver: { name: string; email: string; uid: string };
  type: "room" | "roommate";
  ad: RoomAd | RoommateAd;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser(currentUserId);
      setUser(user);
    }
    fetchUser();
  }, [currentUserId]);

  const handleSendEmail = async () => {
    if (!user) {
      toast.error("Error in sending email");
      return;
    }
    startTransition(async () => {
      if (!message || message.trim().length <= 0) return;
      const uniqueId = Math.random().toString(16).slice(2);
      try {
        const { url } = file ? await uploadFile(uniqueId, file) : { url: undefined };
        const data = await sendEmail(
          { email: user.email, name: user.name, uid: user.uid },
          receiver,
          type,
          ad,
          message.trim(),
          file ? file.name : undefined,
          url ? url : "",
        );

        if (!data) toast.error("Error in sending email");
        else toast.success("Email sent successfully");
      } catch (error) {
        toast.error("Error in sending email");
      }
      setMessage("");
      setFile(undefined);
      (document.getElementById("file") as HTMLInputElement).value = "";
    });
  };

  const handleResetForm = () => {
    setMessage("");
    setFile(undefined);
    (document.getElementById("file") as HTMLInputElement).value = "";
  };

  return (
    <form className="flex flex-col gap-5" action={handleSendEmail}>
      <div className="flex flex-col gap-2">
        <div>
          Your Message
          <Required />
        </div>
        <Textarea
          placeholder="Enter your message here!"
          rows={10}
          className="resize-none"
          id="message"
          name="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>Attach an image file</div>
        <Input
          type="file"
          accept="image/*"
          className="w-fit"
          id="file"
          name="file"
          onChange={e => {
            const file = e.target.files && e.target.files[0];
            if (!file || !file.size) return;
            else if (file.size > 2097152) {
              toast.info("Image size too big. Maximum 2MB allowed");
              e.target.value = "";
            } else {
              setFile(file);
            }
          }}
        />
      </div>
      <div className="flex gap-5">
        <Button className="w-fit" disabled={isPending}>
          <SendIcon className="mr-1 w-4" />
          Send Email
        </Button>
        <Button variant="secondary" className="w-fit" disabled={isPending} type="button" onClick={handleResetForm}>
          <RotateCcwIcon className="mr-1 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
