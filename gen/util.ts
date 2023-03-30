import Schema from "./Schema";
import {Config} from "./Config";

/**
 * Get return type of operation
 * @param operation
 * @param schema
 * @param config
 * @returns The combined return type
 */
export function getReturnType(operation: Schema.Operation, schema: Schema, config: Config): string {
    return operation.returns.filter(r => r.status >= 200 && r.status < 300).map(r => r.type.endsWith("[]") ? `${config.name}.PaginatedData<${schema.models.find(m => m.name === r.type.slice(0, -2)) ? `${config.name}.${r.type}` : r.type}>` : schema.models.find(m => m.name === r.type) ? `${config.name}.${r.type}` : r.type).join(" | ");
}

/**
 * Get return description of operation
 * @param operation
 * @param schema
 * @param config
 * @returns The combined return description
 */
export function getReturnDescription(operation: Schema.Operation): string {
    return operation.returns.filter(r => r.status >= 200 && r.status < 300 && r.description).map(r => r.description).join(" ");
}

/**
 * Get types the operation throws
 * @param operation
 * @param schema
 * @param config
 * @returns The types the operation throws
 */
export function getThrows(operation: Schema.Operation, schema: Schema, config: Config): string[] {
    return operation.returns.filter(r => !(r.status >= 200 && r.status < 300)).map(r => schema.models.find(m => m.name === r.type.split(" ")[0]) ? `${config.name}.${r.type}` : r.type);
}

/**
 * Add extra return values to all operations
 * 401 and 403 are added if the operation uses a token. 500 is added to all operations.
 * @param schema
 * @returns The modified schema
 */
export function addExtraReturns(schema: Schema): Schema {
    for (const [name, operation] of Object.entries(schema.operations)) {
        if (operation.type === "namespace")
            for (const [opName, op] of Object.entries(operation.operations))
                operation.operations[opName] = addExtraReturnsToOperation(op);
        else schema.operations[name] = addExtraReturnsToOperation(operation);
    }
    return schema;
}

/**
 * Add extra returns to an operation
 * @param operation
 * @returns The modified operation
 */
function addExtraReturnsToOperation(operation: Schema.Operation): Schema.Operation {
    if (operation.token !== undefined)
        operation.returns.push({
            status: 401,
            type: 'Error & {code: "UNAUTHORIZED"}'
        }, {
            status: 403,
            type: 'Error & {code: "NO_PERMISSION"}'
        });
    operation.returns.push({
        status: 429,
        type: 'Error & {code: "RATE_LIMITED"}'
    }, {
        status: 500,
        type: 'Error & {code: "INTERNAL_SERVER_ERROR"}'
    }, {
        status: 503,
        type: 'Error & {code: "MAINTENANCE"}'
    });
    return operation;
}

/**
 * Replaces types of model properties that are a model
 * @param schema
 * @param config
 * @returns The modified schema
 */
export function replaceModelTypes(schema: Schema, config: Config): Schema {
    for (const modelID in schema.models) {
        const model = schema.models[modelID]!;
        for (const fieldID in model.fields) {
            const field = model.fields[fieldID]!;
            if (schema.models.find(m => m.name === field.type))
                schema.models[modelID]!.fields[fieldID]!.type = `${config.name}.${field.type}`;
        }
    }
    return schema;
}
