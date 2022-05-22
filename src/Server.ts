import fetch from "isomorphic-fetch";
import path from "path";

import { env } from "./Environment";
import { EmailSender } from "./EmailSender";

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
        .sender(env.sender)
        .recipients(env.recipients)
        .subject("CAT FACTS")
        .template(path.join(templatePath, "cat-facts.mjml"), {
            fact: resultJson.fact,
        });

    await mailer.send(env.simulate);
};

try {
    main();
} catch (err) {
    console.log(err);
}
