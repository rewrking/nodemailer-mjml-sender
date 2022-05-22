import {
    createTestAccount,
    createTransport,
    SentMessageInfo,
    Transporter,
} from "nodemailer";
import { minify } from "html-minifier";
import { MjmlReader, MjmlTemplateProps } from "./MjmlReader";

type Optional<T> = T | null;

export type TransporterAuthUser = {
    user: string;
    pass: string;
};

export type EmailTransporterOptions = {
    host: string;
    port: number;
    secure: boolean;
    auth: TransporterAuthUser;
};

export type EmailSenderUser = {
    name: string;
    email: string;
};

export type EmailSenderOptions = {
    sender: EmailSenderUser;
    recipients: string[];
    subject: string;
    html: string;
};

type TestAccountDetails = {
    apiUrl?: string;
};

/**
    587/2525/25 - Non-secure
    465 - SSL

    smtp.gmail.com
*/

class EmailSender {
    private transporterOptions: EmailTransporterOptions = {
        port: 465,
        secure: true,
        host: "",
        auth: {
            user: "",
            pass: "",
        },
    };
    private testAccount: Optional<TestAccountDetails> = null;
    private senderOptions: EmailSenderOptions = {
        subject: "",
        sender: {
            name: "",
            email: "",
        },
        recipients: [],
        html: "",
    };
    private transporterInst: Optional<Transporter<SentMessageInfo>> = null;
    private mjmlInst: Optional<MjmlReader> = null;

    /*
        Transporter
    */
    transporter = ((parent: typeof this) => ({
        host: function (value: EmailTransporterOptions["host"]) {
            parent.transporterOptions.host = value;
            return this;
        },
        secure: function (value: boolean) {
            parent.transporterOptions.secure = value;
            parent.transporterOptions.port = value ? 465 : 587;
            return this;
        },
        account: function ({ user, pass }: Partial<TransporterAuthUser>) {
            parent.transporterOptions.auth = {
                user: user ?? "",
                pass: pass ?? "",
            };
            parent.testAccount = null;
            return this;
        },
        testAccount: function (apiUrl?: string) {
            parent.testAccount = {
                apiUrl,
            };
            return this;
        },
    }))(this);

    /*
        Sender
    */
    sender = ((parent: typeof this) => ({
        subject: function (value: EmailSenderOptions["subject"]) {
            parent.senderOptions.subject = value;
            return this;
        },
        sender: function ({
            name,
            email,
        }: Partial<EmailSenderOptions["sender"]>) {
            parent.senderOptions.sender = {
                name: name ?? "",
                email: email ?? "",
            };
            return this;
        },
        recipients: function (recipients: EmailSenderOptions["recipients"]) {
            parent.senderOptions.recipients = recipients;
            return this;
        },
        template: function (file: string, props?: MjmlTemplateProps): void {
            if (file.endsWith(".mjml")) {
                if (parent.mjmlInst === null) {
                    parent.mjmlInst = new MjmlReader();
                }
                const mjml = parent.mjmlInst.createEmailFromFile(file, props);
                parent.senderOptions.html = minify(mjml, {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeOptionalTags: true,
                    removeTagWhitespace: true,
                });
            } else {
                parent.senderOptions.html = "";
                throw new Error(
                    "Only MJML and plain text are currently supported (file passed to 'createEmailFromFile' without '.mjml')"
                );
            }
        },
    }))(this);

    /*
        Actions
    */
    private createTransport = async () => {
        try {
            if (this.transporterOptions.host.length === 0) {
                throw new Error("host cannot be blank");
            }
            const { user, pass } = this.transporterOptions.auth;
            if (user.length === 0 || pass.length === 0) {
                if (this.testAccount !== null) {
                    this.transporterOptions.auth = await createTestAccount(
                        this.testAccount.apiUrl
                    );
                } else {
                    throw new Error(
                        "user name and/or password cannot be blank"
                    );
                }
            }
            return createTransport(this.transporterOptions);
        } catch (err: any) {
            throw err;
        }
    };

    send = async (simulate: boolean = false): Promise<any> => {
        if (this.transporterInst === null) {
            this.transporterInst = await this.createTransport();
        }
        const { sender, recipients, subject, html } = this.senderOptions;
        if (sender.name.length === 0 || sender.email.length === 0) {
            throw new Error(
                "Can't send email: Sender name and/or email cannot be blank"
            );
        }
        if (recipients.length === 0) {
            throw new Error(
                "Can't send email: Must have at least one recipient"
            );
        }
        if (subject.length === 0) {
            throw new Error("Can't send email: Subject must not be blank");
        }
        if (html.length === 0) {
            throw new Error("Can't send email: html content must not be blank");
        }

        if (!simulate) {
            const info = await this.transporterInst.sendMail({
                from: `"${sender.name}" <${sender.email}>`,
                to: recipients,
                subject,
                html,
            });
            console.log("Email sent:", info.messageId);
            /*if (env.ethereal) {
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }*/
            return info;
        } else {
            console.log(html);
            return {};
        }
    };
}

export { EmailSender };
