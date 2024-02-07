"use client";

import { verifyRecaptcha } from "@/actions/auth";
import { contactEmail } from "@/actions/message";
import Required from "@/components/forms/Required";
import useAuth from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcwIcon, SendIcon } from "lucide-react";
import { FormEvent, createRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

export default function ContactUsForm() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reCaptcha, setReCaptcha] = useState<string | null>();
  const reCaptchaRef = createRef<ReCAPTCHA>();

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName!);
      setEmail(currentUser.email!);
    } else {
      setName("");
      setEmail("");
    }
  }, [currentUser]);

  useEffect(() => {
    if (reCaptcha === null) reCaptchaRef.current?.reset();
  }, [reCaptcha, reCaptchaRef]);

  const isEmptyForm = () => {
    if (currentUser) return message.trim().length === 0;
    else return name.trim().length === 0 && email.length === 0 && message.trim().length === 0;
  };

  const isValidForm = () => {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (message.trim().length > 0 && name.trim().length > 0 && email.length > 0 && email.match(validEmail)) return true;
    return false;
  };

  const handleResetForm = () => {
    if (!currentUser) {
      setName("");
      setEmail("");
    }
    setMessage("");
    setReCaptcha(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!reCaptcha) return;
    const success = verifyRecaptcha(reCaptcha);
    if (!success) return;
    const { data, error } = await contactEmail(name, email, message);
    if (error) toast.error(error.name === "validation_error" ? "Invalid Email" : "Error in sending email");
    else toast.success("Email sent successfully");
    setLoading(false);
    handleResetForm();
  };

  return (
    <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="name">
          Name
          <Required />
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="Enter your name"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={currentUser ? true : false}
        />
      </div>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="email">
          Email
          <Required />
        </Label>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value.trim())}
          disabled={currentUser ? true : false}
        />
      </div>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="message">
          Message
          <Required />
        </Label>
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
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={setReCaptcha}
        ref={reCaptchaRef}
        className="mx-auto mb-2"
        onExpired={() => setReCaptcha(null)}
        onErrored={() => setReCaptcha(null)}
      />
      <div className="flex justify-end gap-2 md:justify-start md:gap-5">
        <Button disabled={!isValidForm() || loading || !reCaptcha}>
          <SendIcon className="mr-1 w-4" />
          Send
        </Button>
        <Button variant="secondary" type="button" onClick={handleResetForm} disabled={isEmptyForm() || loading}>
          <RotateCcwIcon className="mr-1 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
