import FullWrapper from "@/components/page/FullWrapper";
import Image from "next/image";

export default function Demo() {
  const receiverName = "Abhishek Mishra";
  const senderName = "Ashutosh Mishra";
  const senderEmail = "mishraabhishek226@gmail.com";
  const message = "kasjdkajsh kajshdkajsdh akjshdakjshd kasjhd";
  return (
    <FullWrapper className="gap-2">
      <div className="flex items-center gap-2 mb-5">
        <Image alt="roomie-listings" src="/logo.png" width={40} height={40} />
        <h1 className="text-2xl">Roomie Listings</h1>
      </div>
      <h1>Hello, {receiverName}!</h1>
      <div>
        You got a message from{" "}
        <span className="underline underline-offset-2 text-slate-800">
          {senderName} ({senderEmail})
        </span>
        . You can reply to this email to send a response.
      </div>
      <div className="my-5">{message}</div>
      <div>Best Wishes&#44;</div>
      <div>Roommate Listings</div>
    </FullWrapper>
  );
}
