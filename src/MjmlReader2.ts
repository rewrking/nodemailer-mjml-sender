import fs from "fs";
import path from "path";
import mjml2html from "mjml";
import { MJMLParsingOptions } from "mjml-core";

const defaultMjmlOptions: MJMLParsingOptions = {
    keepComments: false,
    beautify: false,
    validationLevel: "soft",
};

class MjmlReader {
    private options: MJMLParsingOptions = defaultMjmlOptions;

    constructor(private rootPath: string = "", options?: MJMLParsingOptions) {
        this.setRootPath(this.rootPath);

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

    setRootPath = (value: string) => {
        this.rootPath = value;
        if (!fs.existsSync(this.rootPath)) {
            throw new Error(`Path doesn't exist: ${value}`);
        }
        if (!fs.lstatSync(this.rootPath).isDirectory()) {
            throw new Error(`Path must be a directory: ${value}`);
        }
    };

    createEmailFromFile = (file: string, props: Record<string, string | number | boolean>) => {
        if (!file.endsWith(".mjml")) {
            throw new Error(`MjmlReader.createEmail expects file to end in '.mjml', found: ${file}`);
        }

        const filePath = path.join(this.rootPath, file);
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

        const parsed: string = data.replace(/{{\s*(\w+)\s*}}/g, (_match: string, p1: string) => {
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
            return "undefined";
        });

        const result = mjml2html(parsed, this.options);
        return result.html;
    };
}

export { MjmlReader };
