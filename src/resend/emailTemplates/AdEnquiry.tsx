interface EmailTemplateProps {
  receiverName: string;
  senderName: string;
  senderEmail: string;
  message: string;
  listingTitle: string;
  listingLink: string;
}

export const AdEnquiryTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  receiverName,
  senderEmail,
  senderName,
  message,
  listingTitle,
  listingLink,
}) => {
  return (
    <div>
      <div>Hello, {receiverName}!</div>
      <p>
        You got a message from{" "}
        <span style={{ color: "rgb(30, 41, 59)", textDecoration: "underline" }}>
          {senderName} ({senderEmail})
        </span>
        . You can reply to this email to send a response. This email is intended for the following listing.{" "}
        <a href={listingLink}>{listingTitle}</a>
      </p>
      <p style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>{message}</p>
      <div>Best Wishes&#44;</div>
      <div>Roomie Listings</div>
      <img alt="roomie-listings" src="roomielistings.com/logo.png" width={20} height={20} />
    </div>
  );
};
