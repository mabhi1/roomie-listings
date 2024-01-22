"use client";

import { RotateCcwIcon, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { HouseAd, RoommateAd, User } from "@/lib/types";
import Required from "./Required";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { sendEmail } from "@/actions/message";
import { uploadFile } from "@/firebase/firebaseDBFunctions";

export default function MessageForm({
  sender,
  receiver,
  type,
  ad,
}: {
  sender: User;
  receiver: User;
  type: string;
  ad: HouseAd | RoommateAd;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const handleSendEmail = async () => {
    startTransition(async () => {
      if (!message || message.trim().length <= 0) return;
      const uniqueId = Math.random().toString(16).slice(2);
      try {
        const { url } = file ? await uploadFile(uniqueId, file) : { url: undefined };
        const data = await sendEmail(
          sender,
          receiver,
          type,
          ad,
          message.trim(),
          file ? file.name : undefined,
          url ? url : ""
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
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>Attach a file</div>
        <Input
          type="file"
          className="w-fit"
          id="file"
          name="file"
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (!file || !file.size) return;
            else if (file.size > 5133193) {
              toast.info("Video size too big. Maximum 5MB allowed");
              e.target.value = "";
            } else {
              setFile(file);
            }
          }}
        />
      </div>
      <div className="flex gap-5">
        <Button className="w-fit" disabled={isPending}>
          <SendIcon className="w-4 mr-1" />
          Send Email
        </Button>
        <Button variant="secondary" className="w-fit" disabled={isPending} type="button" onClick={handleResetForm}>
          <RotateCcwIcon className="w-4 mr-1" />
          Reset
        </Button>
      </div>
    </form>
  );
}
