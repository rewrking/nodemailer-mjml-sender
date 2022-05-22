import nodemailer from "nodemailer";
import fetch from "isomorphic-fetch";
import path from "path";

import { env } from "./Environment";
import { MjmlReader } from "./MjmlReader2";

const main = async () => {
    /**
     * 587/2525/25 - Non-secure
     * 465 - SSL
     */
    /*const { user, pass } = await nodemailer.createTestAccount();
    const etherealSettings = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
    };*/

    const gmailSettings = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: env.authGmail,
    };

    const transporter = nodemailer.createTransport(gmailSettings);

    const { sender, recipients, sendEmail } = env;

    const mjml = new MjmlReader(path.join(process.cwd(), "templates"));

    const res = await fetch("https://catfact.ninja/fact");
    if (res.status !== 200) {
        throw new Error("error getting cat facts");
    }
    const resultJson = await res.json();
    const html = mjml.createEmailFromFile("cat-facts.mjml", {
        fact: resultJson.fact,
    });

    if (sendEmail) {
        let info = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipients,
            subject: "CAT FACTS",
            html,
        });
        console.log("Message sent: %s", info.messageId);
        /*if (env.ethereal) {
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }*/
    } else {
        console.log(html);
    }
};

try {
    main();
} catch (err) {
    console.log(err);
}
