"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import FullWrapper from "./FullWrapper";
import PageHeader from "./PageHeader";
import Image from "next/image";
import Link from "next/link";

export default function LoginRequest({ message }: { message?: string | undefined }) {
  const router = useRouter();
  return (
    <FullWrapper className="mt-20">
      <Card className="relative w-1/2 mx-auto">
        <CardHeader>
          <PageHeader heading="Authentication Required" className="text-destructive" backButton={false} />
          <CardDescription>{message || "Please login to continue."}</CardDescription>
        </CardHeader>
        <CardContent className="space-x-5">
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
          <Link href="/signin" legacyBehavior passHref>
            <Button>Sign in</Button>
          </Link>
        </CardContent>
        <CardFooter>
          <Image
            src="/login-req.png"
            alt="Sign in Required"
            width={100}
            height={100}
            className="w-auto absolute right-6 top-6"
            priority
          />
        </CardFooter>
      </Card>
    </FullWrapper>
  );
}
