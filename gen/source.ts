import Schema from "./Schema";
import fs from "node:fs/promises";
import path from "node:path";
import Mustache from "mustache";
import {Config} from "./Config";
import {getReturnDescription, getReturnType, getThrows, replaceModelTypes} from "./util.js";
import Package from "./Package";

interface FlatOperation {
    name: string;
    returnType: string;
    returnDescription?: string;
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

export default async (schema: Schema, config: Config, pkg: Package) => {

    schema = replaceModelTypes(schema, config);

    // create flat operations
    // @param [name, value][]
    const flatOperations = (input: [string, Schema.Operation][]): FlatOperation[] => {
        const operations: FlatOperation[] = [];
        for (const [name, operation] of input) {
            const returnType = getReturnType(operation, schema, config);
            const returnDescription = getReturnDescription(operation);
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
                body: "{" + p.body.map(p => p.name).join(", ") + "}"
            }

            const throws = getThrows(operation, schema, config);

            operations.push({
                name,
                returnType,
                returnDescription,
                params,
                allParams,
                tsArgs,
                operation: JSON.stringify(operation),
                description: operation.description,
                method: operation.method,
                path: operation.path,
                throws
            });
        }
        return operations;
    }

    // get operation namespaces
    const namespaces: FlatNamespace[] = [];
    for (const [name, namespace] of Object.entries(schema.operations).filter(([_name, operation]) => operation.type === "namespace") as [string, Schema.Operation.Namespace][]) {
        namespaces.push({name, operations: flatOperations(Object.entries(namespace.operations))});
    }

    // get operations without namespace
    const operations = flatOperations(Object.entries(schema.operations).filter(([_name, operation]) => operation.type !== "namespace") as [string, Schema.Operation][]);

    // load render main class from `/gen/templates/main.mustache`
    const mainTemplate = await fs.readFile(path.join("gen", "templates", "main.mustache"), "utf8");
    const mainRender = Mustache.render(mainTemplate, {schema, config, namespaces, operations, pkg});
    // write file to `/src/{{config.name}}.ts`
    await fs.writeFile(path.join("src", `${config.name}.ts`), mainRender);
}
