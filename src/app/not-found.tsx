import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import notFoundImage from "../../public/not-found.png";

export default function NotFound() {
  return (
    <FullWrapper>
      <PageHeader heading="OOPS! Page not found" subHeading="The page you are looking for does not exists." />
      <div className="mx-auto mt-3 space-y-3 text-center md:mt-20 md:w-1/2 md:space-y-5">
        <Image
          src={notFoundImage}
          alt="Error"
          width={260}
          height={260}
          className="mx-auto w-[500px]"
          priority
          placeholder="blur"
        />
        <Link href="/" passHref legacyBehavior>
          <Button variant="secondary">
            <HomeIcon className="mr-1 w-4" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </FullWrapper>
  );
}
