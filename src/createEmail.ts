import React from "react";
import ReactDOMServer from "react-dom/server";

import fs from "fs";
import path from "path";

import Email from "./components/Email";

const root = path.join(__dirname, "../");

const inlinedCss = fs.readFileSync(root + "public/inlined.css", "utf8");
const emailTemplate = fs.readFileSync(root + "public/template.html", "utf8");

const STYLE_TAG = "/*STYLE*/";
const CONTENT_TAG = "%CONTENT%";

export default (data: any) => {
    const emailElement = React.createElement(Email, { data });
    const content = ReactDOMServer.renderToStaticMarkup(emailElement);

    return emailTemplate.replace(CONTENT_TAG, content).replace(STYLE_TAG, inlinedCss);
};
