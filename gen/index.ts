import Schema from "./Schema";
import path from "node:path";
import fs from "node:fs/promises";
import {Config} from "./Config";
import Mustache from "mustache";

// load `/schema.json`
const schema: Schema = JSON.parse(await fs.readFile(path.join("..", "schema.json"), "utf8"));

// create folder `/src` if it doesn't exist
try {
    await fs.mkdir(path.join("..", "src"));
}
catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code !== "EEXIST") throw e;
}

// load `/gen/config.json`
const config: Config = JSON.parse(await fs.readFile("config.json", "utf8"));

// load render main class from `/gen/templates/main.mustache`
const mainTemplate = await fs.readFile(path.join("templates", "main.mustache"), "utf8");
const mainRender = Mustache.render(mainTemplate, {schema, config});
// write file to `/src/{{config.name}}.ts`
await fs.writeFile(path.join("..", "src", `${config.name}.ts`), mainRender);
