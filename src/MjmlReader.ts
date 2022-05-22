import fs from "fs";
import path from "path";
import mjml2html from "mjml";
import { MJMLParsingOptions } from "mjml-core";

const defaultMjmlOptions: MJMLParsingOptions = {
    keepComments: false,
    beautify: false,
    validationLevel: "soft",
};

export type MjmlTemplateProps = Record<string, string | number | boolean>;

class MjmlReader {
    private options: MJMLParsingOptions = defaultMjmlOptions;

    constructor(options?: MJMLParsingOptions) {
        if (options) {
            this.setOptions(options);
        }
    }

    setOptions = (options: MJMLParsingOptions) => {
        this.options = {
            ...defaultMjmlOptions,
            ...options,
        };
    };

    createEmailFromFile = (filePath: string, props?: MjmlTemplateProps) => {
        const file = path.basename(filePath);
        if (!filePath.endsWith(".mjml")) {
            throw new Error(
                `MjmlReader.createEmail expects file to end in '.mjml', found: ${file}`
            );
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`File doesn't exist: ${file}`);
        }
        if (!fs.lstatSync(filePath).isFile()) {
            throw new Error(`Path must be a file: ${file}`);
        }

        let data: string;
        try {
            data = fs.readFileSync(filePath, "utf-8");
        } catch (err: any) {
            console.error(err);
            console.error(`Error reading the file: ${file}.`);
            return "";
        }

        const parsed: string = data.replace(
            /{{\s*(\w+)\s*}}/g,
            (_match: string, p1: string) => {
                if (props) {
                    const val = props[p1];
                    if (val) {
                        switch (typeof val) {
                            case "string":
                                return val;
                            case "number":
                                return `${val}`;
                            case "boolean":
                                return val ? "true" : "false";
                            default:
                                break;
                        }
                    }
                }
                return "undefined";
            }
        );

        const result = mjml2html(parsed, this.options);
        return result.html;
    };
}

export { MjmlReader };
