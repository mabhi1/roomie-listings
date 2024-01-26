"use client";

import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon, Undo2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import errorImage from "../../public/error.png";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  return (
    <FullWrapper>
      <PageHeader
        heading="OOPS! Something went wrong"
        subHeading="The page you are looking for throws an error. You can either retry or go back."
      />
      <div className="md:w-1/2 mx-auto text-center mt-3 md:mt-20 space-y-5">
        <Image
          src={errorImage}
          alt="Error"
          width={200}
          height={200}
          className="mx-auto w-1/2 md:w-auto"
          priority
          placeholder="blur"
        />
        <h2 className="text-base md:text-xl uppercase overflow-auto">{error.message}</h2>
        <div className="flex gap-5 items-center justify-center">
          <Button variant="secondary" onClick={() => router.back()}>
            <Undo2Icon className="mr-1 w-4" /> Go Back
          </Button>
          <Button onClick={() => reset()}>
            <RotateCcwIcon className="w-4 mr-1" />
            Try again
          </Button>
        </div>
      </div>
    </FullWrapper>
  );
}
