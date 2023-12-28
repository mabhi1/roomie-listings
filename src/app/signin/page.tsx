import GoogleButton from "@/components/button/GoogleButton";
import FullWrapper from "@/components/page/FullWrapper";
import EmailSigninForm from "@/components/forms/EmailSigninForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardSignatureIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import EmailSignupForm from "@/components/forms/EmailSignupForm";

export default function Signin() {
  return (
    <FullWrapper className="pt-20 flex flex-col md:flex-row justify-center">
      <div className="flex justify-center items-start mt-6">
        <Image src="/signin.png" alt="Sign in" width={500} height={500} priority />
      </div>
      <div className="flex flex-col gap-5 w-full max-w-[28rem]">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="account">
              <MailIcon className="mr-1 w-4" />
              Sign in
            </TabsTrigger>
            <TabsTrigger value="password">
              <ClipboardSignatureIcon className="w-4 mr-1" />
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
