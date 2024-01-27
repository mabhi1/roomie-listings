"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyIcon, LockIcon, LogInIcon, UnlockIcon } from "lucide-react";
import { passwordReset, rememberSignIn, signIn } from "@/firebase/firebaseAuthFunctions";
import axios from "axios";
import PageHeader from "../page/PageHeader";

export default function EmailSigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const invalidEmail = () => {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.trim().length === 0 || !email.match(validEmail);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (!remember) await signIn(email, password);
      else await rememberSignIn(email, password);
      return;
    } catch (error: any) {
      setFormLoading(false);
      toast.error(error);
    }
  };

  const handlePasswordReset = async () => {
    if (invalidEmail()) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const { data } = await axios.get(`/api/users?email=${email}&provider=password`);
      if (!data.data) {
        toast.error(data.error);
        return;
      }
      await passwordReset(email);
      toast.success("Password reset email sent");
    } catch (error: any) {
      console.log(error);
      toast.error("Error sending password reset email");
    }
  };

  return (
    <form className="flex justify-center" onSubmit={handleSubmit}>
      <Card className="w-96 border-0 shadow-none">
        <CardHeader className="space-y-1 py-3 md:py-6">
          <PageHeader heading="Sign in with Email" backButton={false} />
          <CardDescription className="hidden text-left md:block">
            Enter your email and password below to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              onChange={e => setEmail(e.target.value)}
              value={email}
              autoFocus
            />
          </div>
          <div className="mt-2 grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="***************"
                onChange={e => setPassword(e.target.value)}
                value={password}
                className="pr-8"
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
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Input
                type="checkbox"
                id="remember"
                name="remember"
                value="remember"
                onChange={e => setRemember(e.target.checked)}
                checked={remember}
                className="h-4 w-4 hover:cursor-pointer"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember Me
              </label>
            </span>
            <Button variant="link" type="button" className="p-0" onClick={handlePasswordReset} disabled={formLoading}>
              <KeyIcon className="mr-1 w-4" />
              Forgot Password?
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-0">
          <Button
            className="w-full"
            type="submit"
            disabled={invalidEmail() || password.trim().length === 0 || formLoading}
          >
            <LogInIcon className="mr-1 w-4" />
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
