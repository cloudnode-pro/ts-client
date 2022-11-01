import {generateDocSchema, generateMarkdownDocs, generateReadme} from "./docs.js";
import {Config} from "./Config";
import fs from "node:fs/promises";
import path from "node:path";
import Schema from "./Schema";
import Package from "./Package";
import {addExtraReturns} from "./util.js";

// load `/schema.json`
const schema: Schema = addExtraReturns(JSON.parse(await fs.readFile("schema.json", "utf8")));

// load `/package.json`
const pkg: Package = JSON.parse(await fs.readFile("package.json", "utf8"));

// load `/gen/config.json`
const config: Config = JSON.parse(await fs.readFile(path.join("gen", "config.json"), "utf8"));

// generate doc schema
const docSchema = await generateDocSchema(schema, config, pkg);
// generate readme
const docMD = generateMarkdownDocs(docSchema, true);
await generateReadme(docMD, config, pkg);
