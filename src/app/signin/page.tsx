import GoogleButton from "@/components/buttons/GoogleButton";
import FullWrapper from "@/components/page/FullWrapper";
import EmailSigninForm from "@/components/forms/EmailSigninForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardSignatureIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import EmailSignupForm from "@/components/forms/EmailSignupForm";
import signInImage from "../../../public/signin.png";

export default function Signin() {
  return (
    <FullWrapper className="pt-5 md:flex-row md:justify-center md:pt-20 xl:gap-10">
      <div className="mt-6 hidden items-start justify-center md:flex">
        <Image src={signInImage} alt="Sign in" width={500} height={500} priority placeholder="blur" />
      </div>
      <div className="flex w-full max-w-[28rem] flex-col gap-3 md:gap-5">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="account">
              <MailIcon className="mr-1 w-4" />
              Sign in
            </TabsTrigger>
            <TabsTrigger value="password">
              <ClipboardSignatureIcon className="mr-1 w-4" />
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="border-0">
            <EmailSigninForm />
          </TabsContent>
          <TabsContent value="password">
            <EmailSignupForm />
          </TabsContent>
        </Tabs>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>
        <GoogleButton />
      </div>
    </FullWrapper>
  );
}
