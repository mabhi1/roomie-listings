"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import FullWrapper from "./FullWrapper";
import PageHeader from "./PageHeader";
import Image from "next/image";
import Link from "next/link";
import { LogInIcon, RotateCcwIcon } from "lucide-react";
import loginRequestImage from "../../../public/login-req.png";

export default function LoginRequest({ message, fallbackUrl }: { message?: string | undefined; fallbackUrl: string }) {
  const router = useRouter();
  return (
    <FullWrapper className="mt-20">
      <Card className="relative mx-auto md:w-2/3 xl:w-1/2">
        <CardHeader>
          <PageHeader heading="Sign in Required" className="text-destructive" backButton={false} />
          <CardDescription>{message || "Please login to continue."}</CardDescription>
        </CardHeader>
        <CardContent className="space-x-5">
          <Button variant="secondary" onClick={() => router.back()}>
            <RotateCcwIcon className="mr-1 w-4" />
            Go Back
          </Button>
          <Link href={`/signin?fallbackUrl=${fallbackUrl}`} legacyBehavior passHref>
            <Button>
              <LogInIcon className="mr-1 w-4" />
              Sign in
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="hidden md:flex">
          <Image
            src={loginRequestImage}
            alt="Sign in Required"
            width={100}
            height={100}
            className="absolute right-6 top-6 w-auto"
            priority
            placeholder="blur"
          />
        </CardFooter>
      </Card>
    </FullWrapper>
  );
}
