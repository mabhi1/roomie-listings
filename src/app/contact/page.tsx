import ContactUsForm from "@/components/forms/ContactForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import Image from "next/image";
import contactUsImage from "../../../public/contact-us.png";

export default function ContactUs() {
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader heading="Contact Us" subHeading="Fill and submit the form below to send us your queries." />
      <div className="w-full flex gap-10 justify-between">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <ContactUsForm />
        </div>
        <div className="hidden md:block relative w-1/3 lg:w-1/2">
          <Image
            src={contactUsImage}
            alt="Contact us"
            width={790}
            height={600}
            className="h-auto w-full"
            priority
            placeholder="blur"
          />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
