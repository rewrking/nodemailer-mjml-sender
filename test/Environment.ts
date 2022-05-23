import dotenv from "dotenv";
dotenv.config();

const simulate: boolean = process.env.EMAIL_SIMULATE === "true";

const recipients = process.env.EMAIL_RECIPIENTS ?? "";

const env = {
    smtpServer: process.env.TRANSPORTER_SMTP_SERVER ?? "",
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS,
    },
    sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
    },
    replyTo: process.env.REPLY_TO_EMAIL,
    simulate,
    recipients: recipients.replace(/ /g, "").split(","),
};

export { env };
