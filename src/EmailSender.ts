import { createTestAccount, createTransport, SentMessageInfo, Transporter } from "nodemailer";
import html2text from "html-to-text";
import { minify } from "html-minifier";
import { MjmlReader, MjmlTemplateProps } from "./MjmlReader";

type Optional<T> = T | null;

export type SentEmailDetails = {
    accepted: string[];
    rejected: string[];
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: {
        from: string;
        to: string[];
    };
    messageId: string;
    text: string;
    html: string;
};

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
    to: string[];
    subject: string;
    html: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
};

type TestAccountDetails = {
    apiUrl?: string;
};

export type TransporterDetails = {
    host(value: EmailTransporterOptions["host"]): TransporterDetails;
    secure(value: boolean, port?: number): TransporterDetails;
    account(authUser: Partial<TransporterAuthUser>): TransporterDetails;
    testAccount(apiUrl?: string): TransporterDetails;
};

export type SenderDetails = {
    subject(value: EmailSenderOptions["subject"]): SenderDetails;
    from(sender: Partial<EmailSenderOptions["sender"]>): SenderDetails;
    to(to: EmailSenderOptions["to"]): SenderDetails;
    cc(cc: EmailSenderOptions["cc"]): SenderDetails;
    bcc(bcc: EmailSenderOptions["bcc"]): SenderDetails;
    replyTo(replyTo: EmailSenderOptions["replyTo"]): SenderDetails;
    template(file: string, props?: MjmlTemplateProps): void;
};

/**
    587/2525/25 - Non-secure
    465 - SSL
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
        to: [],
        html: "",
    };
    private transporterInst: Optional<Transporter<SentMessageInfo>> = null;
    private mjmlInst: Optional<MjmlReader> = null;

    /*
        Transporter
    */
    transporter: TransporterDetails = ((parent: typeof this) => ({
        host: function (value: EmailTransporterOptions["host"]) {
            parent.transporterOptions.host = value;
            return this;
        },
        secure: function (value: boolean, port?: number) {
            parent.transporterOptions.secure = value;
            parent.transporterOptions.port = port ?? (value ? 465 : 587);
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
    sender: SenderDetails = ((parent: typeof this) => ({
        subject: function (value: EmailSenderOptions["subject"]) {
            parent.senderOptions.subject = value;
            return this;
        },
        from: function ({ name, email }: Partial<EmailSenderOptions["sender"]>) {
            parent.senderOptions.sender = {
                name: name ?? "",
                email: email ?? "",
            };
            return this;
        },
        to: function (to: EmailSenderOptions["to"]) {
            parent.senderOptions.to = to;
            return this;
        },
        cc: function (cc: EmailSenderOptions["cc"]) {
            parent.senderOptions.cc = cc;
            return this;
        },
        bcc: function (bcc: EmailSenderOptions["bcc"]) {
            parent.senderOptions.bcc = bcc;
            return this;
        },
        replyTo: function (bcc: EmailSenderOptions["replyTo"]) {
            parent.senderOptions.replyTo = bcc;
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
                    this.transporterOptions.auth = await createTestAccount(this.testAccount.apiUrl);
                } else {
                    throw new Error("user name and/or password cannot be blank");
                }
            }
            return createTransport(this.transporterOptions);
        } catch (err: any) {
            throw err;
        }
    };

    send = async (simulate: boolean = false): Promise<SentEmailDetails> => {
        if (this.transporterInst === null) {
            this.transporterInst = await this.createTransport();
        }
        const { sender, to, subject, html, ...senderOptions } = this.senderOptions;
        if (sender.name.length === 0 || sender.email.length === 0) {
            throw new Error("Can't send email: Sender name and/or email cannot be blank");
        }
        if (to.length === 0) {
            throw new Error("Can't send email: Must have at least one recipient");
        }
        if (subject.length === 0) {
            throw new Error("Can't send email: Subject must not be blank");
        }
        if (html.length === 0) {
            throw new Error("Can't send email: html content must not be blank");
        }

        const text = html2text
            .convert(html, {
                wordwrap: 130,
            })
            .replace(/\n\n/g, "\n");

        if (simulate) {
            let domain: string;
            if (sender.email.includes("@")) {
                domain = sender.email.split("@")[1];
            } else {
                domain = sender.email;
            }
            return {
                accepted: to,
                rejected: [],
                envelopeTime: 0,
                messageTime: 0,
                messageSize: 0,
                response: "250 2.0.0 OK",
                envelope: {
                    from: sender.email,
                    to,
                },
                messageId: `<9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d@${domain}>`,
                text,
                html,
            };
        } else {
            const info = await this.transporterInst.sendMail({
                ...senderOptions,
                from: `"${sender.name}" <${sender.email}>`,
                to,
                subject,
                text,
                html,
            });
            return {
                ...info,
                text,
                html,
            };
        }
    };
}

export { EmailSender };
