import fetch from "isomorphic-fetch";
import path from "path";

import { env } from "./Environment";
import { EmailSender } from "../src/EmailSender";

/*
    To run the test, create a .env file with the following:

    GMAIL_EMAIL=(your gmail)
    GMAIL_APP_PASS=(create a gmail app password)

    SENDER_NAME=(Your name)
    SENDER_EMAIL=(Your gmail)

    EMAIL_RECIPIENTS=(comma-separated recipients)

    EMAIL_SIMULATE=(set to true to simulate sending the email, false to actually send it)
*/

const main = async () => {
    const mailer = new EmailSender();
    // mailer.transporter.host("smtp.ethereal.email").secure(false).testAccount();
    mailer.transporter
        .host("smtp.gmail.com")
        .secure(true)
        .account(env.authGmail);

    const res = await fetch("https://catfact.ninja/fact");
    if (res.status !== 200) {
        throw new Error("error getting cat facts");
    }
    const resultJson = await res.json();

    const templatePath = path.join(process.cwd(), "templates");
    mailer.sender
        .from(env.sender)
        .to(env.recipients)
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
