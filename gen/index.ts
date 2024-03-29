import Schema from "./Schema";
import fs from "node:fs/promises";
import {Config} from "./Config";
import path from "node:path";
import source from "./source.js";
import {generateDocSchema, generateMarkdownDocs, generateReadme} from "./docs.js";
import Package from "./Package";
import {addExtraReturns} from "./util.js";
import * as child_process from "child_process";
import {promisify} from "util";
import {createBrowser} from "./browser.js";

// load `/schema.json`
const schema: Schema = addExtraReturns(JSON.parse(await fs.readFile("schema.json", "utf8")));

// load `/package.json`
const pkg: Package = JSON.parse(await fs.readFile("package.json", "utf8"));

// create folder `/src` if it doesn't exist
try {
    await fs.mkdir("src");
}
catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code !== "EEXIST") throw e;
}

// load `/gen/config.json`
const config: Config = JSON.parse(await fs.readFile(path.join("gen", "config.json"), "utf8"));

// generate source code
await source(schema, config, pkg);

// build
await promisify(child_process.exec)("npm run build");

// generate browser version
await createBrowser(config);

// generate doc schema
const docSchema = await generateDocSchema(schema, config, pkg);
// generate readme
const docMD = generateMarkdownDocs(config, schema, docSchema, true);
await generateReadme(docMD, config, pkg);
