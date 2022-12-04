import Schema from "./Schema";
import {Config} from "./Config";
import {getReturnType, getThrows, replaceModelTypes} from "./util.js";
import DocSchema from "./DocSchema.js";
import fs from "node:fs/promises";
import Package from "./Package";
import Mustache from "mustache";
import * as child_process from "child_process";

/**
 * Global types
 */
export const globalTypes = {
    paginatedData: (config: Config) => new DocSchema.Group(config.name + ".PaginatedData<T>", "Interface", "Paginated response", [
        new DocSchema.Property("items", "T[]", "The page items"),
        new DocSchema.Property("total", "number", "The total number of items"),
        new DocSchema.Property("limit", "number", "The number of items per page"),
        new DocSchema.Property("page", "number", "The current page number")
    ]),
    apiResponse: (config: Config) => new DocSchema.Group(config.name + ".ApiResponse<T>", "Class", "An API response. This class implements the interface provided as `T`.", [
        new DocSchema.Property("_response", config.name + ".RawResponse", "Raw API response"),
    ]),
    rawResponse: (config: Config) => new DocSchema.Group(config.name + ".RawResponse", "Class", "Raw API response", [
        new DocSchema.Property("headers", "Record<string, string>", "The headers returned by the server.", undefined, true),
        new DocSchema.Property("ok", "boolean", "A boolean indicating whether the response was successful (status in the range `200` – `299`) or not.", undefined, true),
        new DocSchema.Property("redirected", "boolean", "Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry).", undefined, true),
        new DocSchema.Property("status", "number", "The status code of the response.", undefined, true),
        new DocSchema.Property("statusText", "string", "The status message corresponding to the status code. (e.g., `OK` for `200`).", undefined, true),
        new DocSchema.Property("url", "string", "The URL of the response.", undefined, true),
    ])
} as const;

/**
 * Generate doc schema
 * @param schema
 * @param config
 * @param pkg
 */
export function generateDocSchema (schema: Schema, config: Config, pkg: Package): DocSchema {
    schema = replaceModelTypes(schema, config);
    const doc: DocSchema = {groups: []};
    const mainClass = new DocSchema.Group(config.name, "Class", pkg.description, []);
    const mainNamespace = new DocSchema.Group(config.name, "Namespace", pkg.description, []);
    for (const model of schema.models)
        mainNamespace.properties.push(new DocSchema.Group(config.name + "." + model.name, "Interface", model.description, model.fields.map(property => new DocSchema.Property(property.name, property.type, property.description))));
    mainNamespace.properties.push(globalTypes.paginatedData(config));
    mainNamespace.properties.push(globalTypes.apiResponse(config));
    mainNamespace.properties.push(globalTypes.rawResponse(config));
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
        return new DocSchema.Method(config.instanceName + "." + operation.name, operation.description, params, returns, throws, undefined, config.name, true);
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
 * Create a link to a type
 * @param type The type
 * @param config The config
 * @param schema The schema
 */
export function linkType (type: string, config: Config, schema: Schema): string {
    const link = (typeName: string) => {
        typeName = typeName.trim();
        const bareType = typeName.split(".").pop()?.replaceAll("[]", "")?.trim() ?? typeName;
        const model = schema.models.find(model => model.name === bareType);
        if (model) {
            const modelGroup = new DocSchema.Group(config.name + "." + model.name, "Interface", "", []);
            return `[${typeName}](#${modelGroup.anchorName})`;
        }
        const globals = Object.values(globalTypes).map(group => group(config)).find(group => group.displayName.replace(/<(.*)>/g, "").split(/\W/g).includes(bareType));
        if (globals) return `[${typeName}](#${globals.anchorName})`;
        const primitives: Record<string, string> = {
            string: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String",
            number: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number",
            boolean: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
            object: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object",
            any: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object",
            void: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined",
            undefined: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined",
            null: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null",
            Date: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date",
            Record: "https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type",
            Array: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array",
            Promise: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",
            Error: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error",
            RegExp: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp",
            Function: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function",
            Map: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map",
            Set: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set",
            Buffer: "https://nodejs.org/api/buffer.html",
            Blob: "https://developer.mozilla.org/docs/Web/API/Blob",
            URLSearchParams: "https://developer.mozilla.org/docs/Web/API/URLSearchParams",
            FormData: "https://developer.mozilla.org/docs/Web/API/FormData",
        };
        if (bareType in primitives) return `[${typeName}](${primitives[typeName]})`;
        return typeName;
    };

    const fullLink = (typeName: string): string => {
        let parts = typeName.match(/<(.*)>/);
        if (parts) return `${link(typeName.slice(0, parts.index))}<${fullLink(parts[1])}>`;
        const parts1 = typeName.split("|");
        if (parts1.length > 1) return parts1.map(fullLink).join(" | ");
        const parts2 = typeName.split("&");
        if (parts2.length > 1) return parts2.map(fullLink).join(" & ");
        const parts3 = typeName.split(",");
        if (parts3.length > 1) return parts3.map(fullLink).join(", ");
        return link(typeName);
    };

    return `<code>${fullLink(type)}</code>`;
}

/**
 * Generate docs in markdown format
 * @param config
 * @param schema
 * @param docSchema
 * @param [tableOfContents=true]
 */
export function generateMarkdownDocs (config: Config, schema: Schema, docSchema: DocSchema, tableOfContents: boolean = true): string {
    let output = "# Documentation\n\n";
    if (tableOfContents) {
        let toc = "";
        for (const group of docSchema.groups) {
            toc += ` - [${group.displayName}](#${group.anchorName})\n`;
            toc += group.propertiesList(3);
            toc += "\n\n";
        }
        output += `<details open>`;
        output += `  <summary>Table of contents</summary>\n\n`;
        output += toc;
        output += `</details>\n\n`;
    }
    for (const group of docSchema.groups) {
        output += `<a name="${group.anchorName}"></a>\n\n`;
        output += `## ${group.displayName}\n\n`;
        output += group.description;
        output += "\n\n";
        for (const property of group.properties) {
            output += `<a name="${property.anchorName}"></a>\n\n`;
            output += `### ${property.displayName}\n\n`;
            output += property.content(config, schema);
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
        build: `![build: ${buildStatus ? "passing" : "failing"}](https://img.shields.io/badge/build-${buildStatus ? "passing" : "failing"}-%23${buildStatus ? "16a34a" : "dc2626"})`,
        downloads: `![npm downloads](https://img.shields.io/npm/dt/cloudnode-ts?label=downloads)`
    };
    const rendered = Mustache.render(template, {config, pkg, docMD, shield});
    await fs.writeFile("README.md", rendered);
}
