# node-emailer

Node.js based emailer using MJML

To run, create a .env file with the following:

```
GMAIL_EMAIL=(your gmail)
GMAIL_APP_PASS=(create a gmail app password)

DEVELOPMENT=true
ETHEREAL=true (set to false to use gmail)

SENDER_NAME=(Your name)
SENDER_EMAIL=(Your gmail)

RECIPIENTS_DEV=(comma-separated recipients if in DEVELOPMENT=true)
RECIPIENTS_PROD=(comma-separated recipients if DEVELOPMENT=false
```

Use for good, comply with the CAN-SPAM Act, etc.
