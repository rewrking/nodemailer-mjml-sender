# nodemailer-mjml-wrapper

"EmailSender" wrapper class around nodeemailer & MJML. Simply read from an mjml file, setup the transporter & sender, and voila!

The MJML template can take basic handlebars-style variables like `{{ variable }}`.

Example usage:

```typescript
    import path from "path";
    import { EmailSender } from "nodemailer-mjml-wrapper";

    const mailer = new EmailSender();
    mailer.transporter
        .host("smtp.gmail.com")
        .secure(true)
        .account({
            user: "...",
            pass: "..."
        });

    const templatePath = path.join(process.cwd(), "templates");
    mailer.sender
        .sender({
            name: "John Doe",
            email: "foo@bar.biz"
        })
        .recipients(["bar@foo.biz"])
        .subject("You have an email!")
        .template(path.join(templatePath, "email-template.mjml"), {
            variable: "Here is some dynamic variable that needs to be replaced",
        });

    await mailer.send();
```

See the repository's test folder for a more complete example.

---

Use for good, comply with the CAN-SPAM Act, etc.
