import nodemailer from "nodemailer";
import fetch from "isomorphic-fetch";

import { env } from "./env";
import { createEmail } from "./createEmail";
import { CatFact } from "./layouts/CatFact";

const main = async () => {
    /**
     * 587/2525/25 - Non-secure
     * 465 - SSL
     */
    const { user, pass } = await nodemailer.createTestAccount();

    const etherealSettings = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
    };

    const gmailSettings = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: env.authGmail,
    };

    const transporter = nodemailer.createTransport(env.ethereal ? etherealSettings : gmailSettings);

    const { sender, recipients } = env;

    const EMAIL_COUNT: number = 1;
    for (let i = 0; i < EMAIL_COUNT; ++i) {
        setTimeout(async () => {
            try {
                const res = await fetch("https://catfact.ninja/fact");
                if (res.status !== 200) {
                    throw new Error("error getting cat facts");
                }
                const resultJson = await res.json();
                let info = await transporter.sendMail({
                    from: `"${sender.name}" <${sender.email}>`,
                    to: recipients,
                    subject: "CAT FACTS",
                    html: createEmail(CatFact, { fact: resultJson.fact }),
                });
                console.log("Message sent: %s", info.messageId);
                if (env.ethereal) {
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                }
            } catch (err) {
                console.log(err);
            }
        }, 1000);
    }
};

try {
    main();
} catch (err) {
    console.log(err);
}
