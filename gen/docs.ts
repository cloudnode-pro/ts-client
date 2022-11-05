import Schema from "./Schema";
import {Config} from "./Config";
import {getReturnType, getThrows} from "./util.js";
import DocSchema from "./DocSchema.js";
import fs from "node:fs/promises";
import Package from "./Package";
import Mustache from "mustache";
import * as child_process from "child_process";

/**
 * Generate doc schema
 * @param schema
 * @param config
 * @param pkg
 */
export function generateDocSchema (schema: Schema, config: Config, pkg: Package): DocSchema {
    const doc: DocSchema = {groups: []};
    const mainClass = new DocSchema.Group(config.name, "Class", pkg.description, []);
    const mainNamespace = new DocSchema.Group(config.name, "Namespace", pkg.description, []);
    for (const model of schema.models)
        mainNamespace.properties.push(new DocSchema.Group(config.name + "." + model.name, "Interface", model.description, model.fields.map(property => new DocSchema.Property(property.name, property.type, property.description))));
    const operations: (Schema.Operation & {name: string})[] = [];
    for (const [name, operation] of Object.entries(schema.operations)) {
        if (operation.type === "operation") operations.push({name, ...operation});
        else if (operation.type === "namespace")
            for (const [subName, subOperation] of Object.entries(operation.operations))
                operations.push({name: `${name}.${subName}`, ...subOperation});
    }
    // make operations into methods
    const operationMethods = operations.map(operation => {
        const returns = {type: getReturnType(operation, schema, config)};
        const throws = getThrows(operation, schema, config).map(type => ({type}));
        const pathParams = Object.entries(operation.parameters.path ?? {}).map(([name, parameter]) => new DocSchema.Parameter(name, parameter.type, parameter.description, parameter.required, parameter.default));
        const queryParams = Object.entries(operation.parameters.query ?? {}).map(([name, parameter]) => new DocSchema.Parameter(name, parameter.type, parameter.description, parameter.required, parameter.default));
        const bodyParams = Object.entries(operation.parameters.body ?? {}).map(([name, parameter]) => new DocSchema.Parameter(name, parameter.type, parameter.description, parameter.required, parameter.default));
        const params: DocSchema.Parameter[] = [...pathParams, ...queryParams, ...bodyParams];
        return new DocSchema.Method(config.instanceName + "." + operation.name, operation.description, params, returns, throws);
    });
    mainClass.properties.push(...operationMethods);
    mainClass.properties.sort((a, b) => a.displayName.localeCompare(b.displayName));
    mainClass.properties.unshift(new DocSchema.Method(`new ${config.name}`, `Construct a new ${config.name} API client`, [
        new DocSchema.Parameter("token", "string", "API token to use for requests", false),
        new DocSchema.Parameter("baseUrl", "string", "Base URL of the API", false, config.baseUrl)
    ], undefined, []));
    mainNamespace.properties.sort((a, b) => a.displayName.localeCompare(b.displayName));

    doc.groups.push(mainClass);
    doc.groups.push(mainNamespace);
    return doc;
}

/**
 * Generate docs in markdown format
 * @param schema
 * @param [tableOfContents=true]
 */
export function generateMarkdownDocs (schema: DocSchema, tableOfContents: boolean = true): string {
    let output = "# Documentation\n\n";
    if (tableOfContents) {
        let toc = "";
        for (const group of schema.groups) {
            toc += ` - [${group.displayName}](#${group.anchorName})\n`;
            toc += group.propertiesList(3);
            toc += "\n\n";
        }
        output += `<details open>`;
        output += `  <summary>Table of contents</summary>\n\n`;
        output += toc;
        output += `</details>\n\n`;
    }
    for (const group of schema.groups) {
        output += `<a name="${group.anchorName}"></a>\n\n`;
        output += `## ${group.displayName}\n\n`;
        output += group.description;
        output += "\n\n";
        for (const property of group.properties) {
            output += `<a name="${property.anchorName}"></a>\n\n`;
            output += `### ${property.displayName}\n\n`;
            output += property.content;
            output += "\n\n";
        }
        output += "\n\n";
    }

    return output;
}

/**
 * Generate readme
 * @param docMD
 * @param config
 * @param pkg
 */
export async function generateReadme (docMD: string, config: Config, pkg: Package): Promise<void> {
    const template = await fs.readFile("README.template.md", "utf8");
    // check if project builds successfully
    const buildStatus = await new Promise((resolve, reject) => {
        child_process.exec("npm run build", (error, stdout, stderr) => {
            resolve(!error);
        });
    });
    const shield = {
        version: `![Client Version: ${pkg.version}](https://img.shields.io/badge/Client%20Version-${pkg.version}-%2316a34a)`,
        apiVersion: `![API Version: ${config.apiVersion}](https://img.shields.io/badge/API%20Version-${config.apiVersion}-%232563eb)`,
        build: `![build: ${buildStatus ? "passing" : "failing"}](https://img.shields.io/badge/build-${buildStatus ? "passing" : "failing"}-%23${buildStatus ? "16a34a" : "dc2626"})`
    }
    const rendered = Mustache.render(template, {config, pkg, docMD, shield});
    await fs.writeFile("README.md", rendered);
}
