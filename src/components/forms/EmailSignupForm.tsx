"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckSquareIcon, ClipboardEditIcon, LockIcon, UnlockIcon } from "lucide-react";
import { createUser } from "@/firebase/firebaseAuthFunctions";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/lib/types";
import { toastMessage } from "@/lib/constants";
import PageHeader from "../page/PageHeader";
import ReCAPTCHA from "react-google-recaptcha";
import { verifyRecaptcha } from "@/actions/auth";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";

export default function EmailSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [reCaptcha, setReCaptcha] = useState<string | null>(null);

  const userMutation = useMutation({
    mutationFn: (data: User) => {
      return axios.post("/api/users", data);
    },
  });

  const invalidName = () => {
    return name.trim().length === 0;
  };

  const invalidEmail = () => {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.trim().length === 0 || !email.match(validEmail);
  };

  const invalidPassword = () => {
    return password.trim().length < 6;
  };

  const invalidRePassword = () => {
    return password.trim() !== rePassword.trim();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!terms) return;
    if (!reCaptcha) return;
    const success = verifyRecaptcha(reCaptcha);
    if (!success) return;
    setFormLoading(true);
    try {
      const user = await createUser(email, password, name);
      userMutation.mutate({
        uid: user.uid,
        email: user.email!,
        provider: "password",
        name: user.displayName!,
        photo: user.photoURL,
      });
      toast.success(toastMessage.emailVerificationSuccess);
      setReCaptcha(null);
      return;
    } catch (error: any) {
      setFormLoading(false);
      setReCaptcha(null);
      toast.error(error);
    }
  };

  return (
    <form className="flex justify-center" onSubmit={handleSubmit}>
      <Card className="w-96 border-0 shadow-none">
        <CardHeader className="space-y-1 py-3 md:py-6">
          <PageHeader heading="Sign up with Email" backButton={false} />
          <CardDescription className="hidden text-left md:block">
            Enter email and password below to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="relative grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              onChange={e => setName(e.target.value)}
              value={name}
              className={cn(
                name && "outline outline-offset-2",
                invalidName() ? "outline-destructive" : "outline-success",
              )}
              autoFocus
            />
            <span className={cn("absolute right-0 top-0 text-xs text-destructive", name ? "inline" : "hidden")}>
              {invalidName() ? <>{"Invalid Name"}</> : <CheckSquareIcon className="h-4 w-4 text-success" />}
            </span>
          </div>
          <div className="relative mt-2 grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              onChange={e => setEmail(e.target.value)}
              value={email}
              className={cn(
                email && "outline outline-offset-2",
                invalidEmail() ? "outline-destructive" : "outline-success",
              )}
            />
            <span className={cn("absolute right-0 top-0 text-xs text-destructive", email ? "inline" : "hidden")}>
              {invalidEmail() ? <>{"Invalid Email"}</> : <CheckSquareIcon className="h-4 w-4 text-success" />}
            </span>
          </div>
          <div className="relative mt-2 grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="***************"
                onChange={e => setPassword(e.target.value)}
                value={password}
                className={cn(
                  "pr-8",
                  password && "outline outline-offset-2",
                  invalidPassword() ? "outline-destructive" : "outline-success",
                )}
              />
              {showPassword ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-1/2 mr-1 h-8 w-8 -translate-y-1/2 cursor-pointer border-l p-[0.4rem]"
                  onClick={() => setShowPassword(false)}
                >
                  <UnlockIcon />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-1/2 mr-1 h-8 w-8 -translate-y-1/2 cursor-pointer border-l p-[0.4rem]"
                  onClick={() => setShowPassword(true)}
                >
                  <LockIcon />
                </Button>
              )}
            </div>
            <span className={cn("absolute right-0 top-0 text-xs text-destructive", password ? "inline" : "hidden")}>
              {invalidPassword() ? (
                <>{"Must be at least 6 letters"}</>
              ) : (
                <CheckSquareIcon className="h-4 w-4 text-success" />
              )}
            </span>
          </div>
          <div className="relative mt-2 grid gap-2">
            <Label htmlFor="repassword">Re-enter Password</Label>
            <Input
              id="repassword"
              type="password"
              placeholder="***************"
              onChange={e => setRePassword(e.target.value)}
              value={rePassword}
              className={cn(
                rePassword && "outline outline-offset-2",
                invalidRePassword() ? "outline-destructive" : "outline-success",
              )}
            />
            <span className={cn("absolute right-0 top-0 text-xs text-destructive", rePassword ? "inline" : "hidden")}>
              {invalidRePassword() ? (
                <>{"Passwords do not match"}</>
              ) : (
                <CheckSquareIcon className="h-4 w-4 text-success" />
              )}
            </span>
          </div>
          <div className="relative mt-2 flex items-center gap-2">
            <Checkbox
              id="terms&conditions"
              name="acceptTc"
              defaultChecked={false}
              onCheckedChange={checked => setTerms(checked ? true : false)}
              checked={terms}
            />
            <Label htmlFor="terms&conditions">
              I have read and agree to{" "}
              <Link href="/terms&conditions" className="text-primary underline underline-offset-2">
                Terms and Conditions
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-0">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={setReCaptcha}
            className={cn(
              (invalidName() || invalidEmail() || invalidPassword() || invalidRePassword() || formLoading || !terms) &&
                "hidden",
              "mx-auto mb-2",
            )}
            onExpired={() => setReCaptcha(null)}
            onErrored={() => setReCaptcha(null)}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={
              invalidName() ||
              invalidEmail() ||
              invalidPassword() ||
              invalidRePassword() ||
              formLoading ||
              !terms ||
              !reCaptcha
            }
          >
            <ClipboardEditIcon className="mr-1 w-4" />
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
