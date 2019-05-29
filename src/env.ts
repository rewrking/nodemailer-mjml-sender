import dotenv from "dotenv";
dotenv.config();

const development = process.env.DEVELOPMENT;

const recipients = development ? process.env.RECIPIENTS_DEV! : process.env.RECIPIENTS_PROD!;

export default {
    ethereal: process.env.ETHEREAL,
    development: development,
    authGmail: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_API_PASS
    },
    authEthereal: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PASS
    },
    sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL
    },
    recipients: recipients.split(",")
};
