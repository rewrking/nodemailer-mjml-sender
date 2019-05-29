import nodemailer from "nodemailer";
import request from "request-promise-native";
import env from "./env";

import createEmail from "./createEmail";

const main = async () => {
    /**
     * 587/2525/25 - Non-secure
     * 465 - SSL
     */
    const etherealSettings = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: env.authEthereal
    };

    const gmailSettings = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: env.authGmail
    };

    const transporter = nodemailer.createTransport(env.ethereal ? etherealSettings : gmailSettings);

    const EMAIL_COUNT: number = 1;

    const sender = env.sender;
    const recipients = env.recipients;

    for (let i = 0; i < EMAIL_COUNT; i++) {
        setTimeout(async () => {
            try {
                const res = await request("https://catfact.ninja/fact");
                const resultJson = JSON.parse(res);
                let info = await transporter.sendMail({
                    from: `"${sender.name}" <${sender.email}>`,
                    to: recipients,
                    subject: "CAT FACTS",
                    html: createEmail({ fact: resultJson.fact })
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
