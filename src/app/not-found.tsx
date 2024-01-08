import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <FullWrapper>
      <PageHeader heading="OOPS! Page not found" />
      <div className="w-1/2 mx-auto text-center mt-20 space-y-5">
        <Image src="/not-found.png" alt="Error" width={260} height={260} className="mx-auto w-[500px]" priority />
        <Link href="/" passHref legacyBehavior>
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    </FullWrapper>
  );
}
