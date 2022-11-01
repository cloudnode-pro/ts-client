import Schema from "./Schema";
import fs from "node:fs/promises";
import {Config} from "./Config";
import path from "node:path";
import Mustache from "mustache";
import Package from "./Package";

// load `/schema.json`
const schema: Schema = JSON.parse(await fs.readFile("schema.json", "utf8"));

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

interface FlatOperation {
    name: string;
    returnType: string;
    params: {
        path: string;
        query: string;
        body: string;
    }
    allParams: NamedParameter[];
    tsArgs: string;
    operation: string;
    description: string;
    method: string;
    path: string;
    throws: string[];
}

interface FlatNamespace {
    name: string;
    operations: FlatOperation[];
}

interface NamedParameter extends Schema.Operation.Parameter {
    name: string;
    ts: string;
}

// create flat operations
// @param [name, value][]
const flatOperations = (input: [string, Schema.Operation][]): FlatOperation[] => {
    const operations: FlatOperation[] = [];
    for (const [name, operation] of input) {
        const returnType = operation.returns.filter(r => r.status >= 200 && r.status < 300).map(r => {
            return r.type.endsWith("[]") ? `${config.name}.PaginatedData<${schema.models.find(m => m.name === r.type.slice(0, -2)) ? `${config.name}.${r.type}` : r.type}>` : schema.models.find(m => m.name === r.type) ? `${config.name}.${r.type}` : r.type
        }).join(" | ");
        const toFlatParam = ([name, parameter]: [string, Schema.Operation.Parameter]): NamedParameter => {
            const ts = `${name}${!parameter.required && !parameter.default ? "?: " : ": "}${parameter.type}${parameter.default ? ` = ${parameter.default}` : ""}`;
            return {name, ts, ...parameter};
        }

        const p = {
            path: operation.parameters.path ? Object.entries(operation.parameters.path).map(toFlatParam) : [],
            query: operation.parameters.query ? Object.entries(operation.parameters.query).map(toFlatParam) : [],
            body: operation.parameters.body ? Object.entries(operation.parameters.body).map(toFlatParam) : []
        };

        const allParams = [...p.path, ...p.query, ...p.body];
        const tsArgs = allParams.map(p => p.ts).join(", ");

        const params = {
            path: "{" + p.path.map(p => `${p.name}: \`\${${p.name}}\``).join(", ") + "}",
            query: "{" + p.query.map(p => `${p.name}: \`\${${p.name}}\``).join(", ") + "}",
            body: "{" + p.body.map(p => `${p.name}: \`\${${p.name}}\``).join(", ") + "}"
        }

        if (operation.token !== undefined)
            operation.returns.push({
                status: 401,
                type: 'Error & {code: "UNAUTHORIZED"}'
            }, {
                status: 403,
                type: 'Error & {code: "NO_PERMISSION"}'
            });
        operation.returns.push({
            status: 500,
            type: 'Error & {code: "INTERNAL_SERVER_ERROR"}'
        }, {
            status: 429,
            type: 'Error & {code: "RATE_LIMITED"}'
        });

        const throws = operation.returns.filter(r => !(r.status >= 200 && r.status < 300)).map(r => {
            const t = r.type.split(" ")[0];
            // search models
            return schema.models.find(m => m.name === t) ? `${config.name}.${r.type}` : r.type;
        });

        operations.push({name, returnType, params, allParams, tsArgs, operation: JSON.stringify(operation), description: operation.description, method: operation.method, path: operation.path, throws});
    }
    return operations;
}

// get operation namespaces
const namespaces: FlatNamespace[] = [];
for (const [name, namespace] of Object.entries(schema.operations).filter(([name, operation]) => operation.type === "namespace") as [string, Schema.Operation.Namespace][]) {
    namespaces.push({name, operations: flatOperations(Object.entries(namespace.operations))});
}

// get operations without namespace
const operations = flatOperations(Object.entries(schema.operations).filter(([name, operation]) => operation.type !== "namespace") as [string, Schema.Operation][]);

// load render main class from `/gen/templates/main.mustache`
const mainTemplate = await fs.readFile(path.join("gen", "templates", "main.mustache"), "utf8");
const mainRender = Mustache.render(mainTemplate, {schema, config, namespaces, operations});
// write file to `/src/{{config.name}}.ts`
await fs.writeFile(path.join("src", `${config.name}.ts`), mainRender);
