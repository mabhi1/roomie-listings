"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LockIcon, UnlockIcon } from "lucide-react";
import { rememberSignIn, signIn } from "@/firebase/firebaseFunctions";
import { useRouter } from "next/navigation";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const invalidEmail = () => {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.trim().length > 0 && !email.match(validEmail);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (!remember) await signIn(email, password);
      else await rememberSignIn(email, password);
      router.back();
      return;
    } catch (error: any) {
      setFormLoading(false);
      toast.error(error);
    }
  };

  const handlePasswordReset = async () => {
    if (email.length === 0 || invalidEmail()) {
      toast.error("Please enter a valid email");
      return;
    }
    // To be done with database to check if user exists
    // try {
    //   await passwordReset(email);
    //   toast.success("Password reset email sent");
    // } catch (error: any) {
    //   console.log(error);
    //   toast.error("Error sending password reset email");
    // }
  };

  return (
    <form className="flex justify-center" onSubmit={handleSubmit}>
      <Card className="border-0 shadow-none w-96">
        <CardHeader className="space-y-1">
          <CardTitle>Sign in with Email</CardTitle>
          <CardDescription className="text-left">Enter your email and password below to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="grid gap-2 mt-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="***************"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="pr-8"
              />
              {showPassword ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={() => setShowPassword(false)}
                >
                  <UnlockIcon />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 cursor-pointer p-[0.4rem] w-8 h-8 border-l"
                  onClick={() => setShowPassword(true)}
                >
                  <LockIcon />
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="flex gap-1 items-center">
              <Input
                type="checkbox"
                id="remember"
                name="remember"
                value="remember"
                onChange={(e) => setRemember(e.target.checked)}
                checked={remember}
                className="hover:cursor-pointer h-4 w-4"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember Me
              </label>
            </span>
            <Button variant="link" type="button" className="p-0" onClick={handlePasswordReset} disabled={formLoading}>
              Forgot Password?
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-0">
          <Button className="w-full" type="submit" disabled={invalidEmail() || password.length === 0 || formLoading}>
            {formLoading ? "Please wait..." : "Sign in"}
          </Button>
          <Button variant="link" type="button" className="p-1 h-0" disabled={formLoading}>
            Don&apos;t have an account? Click to sign up.
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
