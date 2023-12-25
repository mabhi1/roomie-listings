"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
// import { useToast } from "@/components/ui/use-toast";
import { LockIcon, UnlockIcon } from "lucide-react";
// import { signIn } from "@/firebase/authFunctions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const { toast } = useToast();

  const invalidInputs = () => {
    return email.trim().length === 0 || password.trim().length === 0;
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setFormLoading(true);
  //   try {
  //     return signIn(email, password);
  //   } catch (error: any) {
  //     setFormLoading(false);
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: error,
  //     });
  //   }
  // };

  return (
    <form className="flex justify-center">
      <Card className="border-0 shadow-none w-96">
        <CardHeader className="space-y-1">
          <CardTitle>Login with Email</CardTitle>
          <CardDescription className="text-left">Enter your email and password below to login</CardDescription>
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
                className="hover:cursor-pointer h-4 w-4"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember Me
              </label>
            </span>
            <Button variant="link" type="button" className="p-0">
              Forgot Password?
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-0">
          <Button className="w-full" type="submit" disabled={invalidInputs() || formLoading}>
            {formLoading ? "Please wait..." : "Login"}
          </Button>
          <Button variant="secondary" type="button" className="w-full">
            Signup
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
