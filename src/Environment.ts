import dotenv from "dotenv";
dotenv.config();

const sendEmail: boolean = process.env.SEND_EMAIL === "true";

const recipients = process.env.EMAIL_RECIPIENTS ?? "";

const env = {
    authGmail: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASS,
    },
    sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
    },
    sendEmail,
    recipients: recipients.replace(/ /g, "").split(","),
};

export { env };
