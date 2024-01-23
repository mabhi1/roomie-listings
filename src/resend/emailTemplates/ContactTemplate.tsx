interface EmailTemplateProps {
  senderName: string;
  senderEmail: string;
  message: string;
}

export const ContactTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ senderEmail, senderName, message }) => {
  return (
    <div>
      <div>Hello, Admin!</div>
      <p>
        You got a message from{" "}
        <span style={{ color: "rgb(30, 41, 59)", textDecoration: "underline" }}>
          {senderName} ({senderEmail})
        </span>
        . You can reply to this email to send a response.
      </p>
      <p style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>{message}</p>
      <p>Thanks&#44;</p>
      <p>Your Roomie Listings team</p>
    </div>
  );
};
