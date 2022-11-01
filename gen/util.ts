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
 * Get types the operation throws
 * @param operation
 * @param schema
 * @param config
 * @returns The types the operation throws
 */
export function getThrows(operation: Schema.Operation, schema: Schema, config: Config): string[] {
    return operation.returns.filter(r => !(r.status >= 200 && r.status < 300)).map(r => schema.models.find(m => m.name === r.type.split(" ")[0]) ? `${config.name}.${r.type}` : r.type);
}
