# node-emailer

Node.js based emailer using MJML

To run, create a .env file with the following:

```
GMAIL_EMAIL=(your gmail)
GMAIL_APP_PASS=(create a gmail app password)

SENDER_NAME=(Your name)
SENDER_EMAIL=(Your gmail)

EMAIL_RECIPIENTS=(comma-separated recipients)

SEND_EMAIL=(set to true to actually send the email, false to just compile the mjml)
```

Use for good, comply with the CAN-SPAM Act, etc.
