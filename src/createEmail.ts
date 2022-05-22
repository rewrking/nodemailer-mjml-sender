import mjml2html from "mjml";
import { mjmlOptions } from "./mjmlOptions";

type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

const renderMjml = (mjmlBody: string) => mjml2html(mjmlBody, mjmlOptions);

function createEmail<T extends Function>(template: T, ...args: ArgsType<T>) {
    const result = renderMjml(template(...args));
    return result.html;
}

export { createEmail };
