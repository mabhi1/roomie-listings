import ContactUsForm from "@/components/forms/ContactForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";

export default function ContactUs() {
  return (
    <FullWrapper className="gap-5">
      <PageHeader heading="Contact Us" subHeading="Fill and submit the form below to send us your queries." />
      <div className="w-full flex gap-10 justify-between">
        <div className="w-1/2">
          <ContactUsForm />
        </div>
        <div className="relative w-1/2">
          <Image src="/contact-us.png" alt="Contact us" width={790} height={600} className="h-auto w-full" priority />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
