"use client";

import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  return (
    <FullWrapper>
      <PageHeader heading="OOPS! Something went wrong" />
      <div className="w-1/2 mx-auto text-center mt-20 space-y-5">
        <Image src="/error.png" alt="Error" width={200} height={200} className="mx-auto w-auto" priority />
        <h2 className="text-xl uppercase overflow-auto">{error.message}</h2>
        <div className="space-x-5">
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </FullWrapper>
  );
}
