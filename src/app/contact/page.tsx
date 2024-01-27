import ContactUsForm from "@/components/forms/ContactForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";
import contactUsImage from "../../../public/contact-us.png";

export default function ContactUs() {
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader heading="Contact Us" subHeading="Fill and submit the form below to send us your queries." />
      <div className="flex w-full justify-between gap-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <ContactUsForm />
        </div>
        <div className="relative hidden w-1/3 md:block lg:w-1/2">
          <Image
            src={contactUsImage}
            alt="Contact us"
            width={790}
            height={600}
            className="h-auto w-full"
            priority
            placeholder="blur"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-white/30"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
