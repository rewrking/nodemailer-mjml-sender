import fetch from "isomorphic-fetch";
import path from "path";

import { env } from "./Environment";
import { EmailSender } from "../src/EmailSender";

/*
    To run the test, create a .env file with the following:

    TRANSPORTER_SMTP_SERVER=(your smtp server)
    TRANSPORTER_USER=(your username)
    TRANSPORTER_PASS=(your password)

    SENDER_NAME=(your name)
    SENDER_EMAIL=(your email)
    REPLY_TO_EMAIL=(reply-to email)

    EMAIL_RECIPIENTS=(comma-separated recipients)

    EMAIL_SIMULATE=(set to true to simulate sending the email, false to actually send it)
*/

const main = async () => {
    const mailer = new EmailSender();
    // mailer.transporter.host("smtp.ethereal.email").secure(false).testAccount();

    // prettier-ignore
    mailer.transporter
        .host(env.smtpServer)
        .secure(false)
        .account(env.auth);

    const res = await fetch("https://catfact.ninja/fact");
    if (res.status !== 200) {
        throw new Error("error getting cat facts");
    }
    const resultJson = await res.json();

    const templatePath = path.join(process.cwd(), "templates");

    // prettier-ignore
    mailer.sender
        .from(env.sender)
        .to(env.recipients)
        .replyTo(env.replyTo)
        .subject("CAT FACTS")
        .template(path.join(templatePath, "cat-facts.mjml"), {
            fact: resultJson.fact,
        });

    const result = await mailer.send(env.simulate);
    if (env.simulate) {
        console.log("Email sent:", result.messageId);
        console.log(result);
    } else {
        console.log("Email sent:", result.messageId);
    }
};

try {
    main();
} catch (err) {
    console.log(err);
}
