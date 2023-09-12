import {Config} from "./Config";
import Schema from "./Schema";
import {linkType} from "./docs.js";

interface DocSchema {
    groups: DocSchema.Group[];
}

namespace DocSchema {
    export abstract class Entry {
        public name: string;
        public readonly type: string;
        public readonly typeName?: string;
        public readonly isStatic?: true;

        protected constructor(name: string, type: string, isStatic?: true, alwaysTypeName?: true) {
            this.name = name;
            this.type = type;
            this.isStatic = isStatic;
            this.typeName = this.isStatic ? `Static ${this.type.toLowerCase() === "function" ? "method" : "property"}` : alwaysTypeName ? this.type : undefined;
        }

        public get displayName(): string {
            return this.typeName ? `${this.typeName}: \`${this.name}\`` : `\`${this.name}\``;
        }

        public get anchorName(): string {
            return this.displayName.toLowerCase().replace(/[^a-z\d\s]/g, "").replace(/\s+/g, "-");
        }

        public abstract content(config: Config, schema: Schema): string;
    }

    export class Property extends Entry {
        public readonly description: string;
        public readonly readonly?: true;

        constructor(name: string, type: string, description: string, isStatic?: true, readonly?: true) {
            super(name, type, isStatic);
            this.description = description;
            this.readonly = readonly;
        }

        public override content(config: Config, schema: Schema): string {
            return `${this.description}\n\n - Type: ${linkType(this.type, config, schema)}${this.readonly ? "\n - Read-only" : ""}`;
        }

        public inlineContent(config: Config, schema: Schema): string {
            return `\`${this.name}\` ${linkType(this.type, config, schema)} ${this.description}${this.readonly ? " (read-only)" : ""}`;
        }
    }


    export class Parameter extends Property {
        public readonly default?: string;
        public readonly required: boolean;

        constructor(name: string, type: string, description: string, required: boolean, default_?: string) {
            super(name, type, description);
            this.default = default_;
            this.required = required;
        }

        public override content(config: Config, schema: Schema): string {
            return `${this.description}\n\n - Type: ${linkType(this.type, config, schema)}\n - Default: \`${this.default}\`\n - Required: \`${this.required}\``;
        }

        public override inlineContent(config: Config, schema: Schema): string {
            return `\`${this.name}\` ${linkType(this.type, config, schema)} ${this.description} (default: \`${this.default}\`, required: \`${this.required}\`)`;
        }
    }

    export class Method extends Property {
        public readonly params: Parameter[];
        public readonly returns?: {type: string, description?: string};
        public readonly throws: {type: string, description?: string}[];
        public readonly mainClassName?: string;
        public readonly async?: true;

        constructor(name: string, description: string, params: Parameter[], returns: {type: string, description?: string} | undefined, throws: {type: string, description?: string}[], isStatic?: true, mainClassName?: string, async?: true) {
            super(name, "Function", description, isStatic);
            this.params = params;
            this.returns = returns;
            this.throws = throws;
            this.name = `${this.name}(${this.paramsString})`;
            this.mainClassName = mainClassName;
            this.async = async;
        }

        public get paramsString(): string {
            return this.params.map(p => !p.required || p.default ? `[${p.name}]` : p.name).join(", ");
        }

        public override content(config: Config, schema: Schema): string {
            return `${this.description}\n\n${this.params.map(p => ` - \`${p.name}\` ${linkType(p.type, config, schema)} ${p.description}${p.description.endsWith(".") ? "" : "."}${p.default ? ` Default: \`${p.default}\`` : ""}`).join("\n")}\n${this.returns ? ` - Returns: ${linkType(`${this.async ? "Promise<" : ""}${this.mainClassName ? `${this.mainClassName}.ApiResponse<` : ""}${this.returns.type}${this.mainClassName ? ">" : ""}${this.async ? ">" : ""}`, config, schema)}${this.returns.description ? ` ${this.returns.description}` : ""}` : ""}\n${this.throws.map(t => ` - Throws: ${linkType(t.type, config, schema)}${t.description ? ` ${t.description}` : ""}`).join("\n")}`;
        }
    }

    export class Group extends Entry {
        public readonly description: string;
        public readonly properties: (Property | Group)[];

        constructor(name: string, type: "Class" | "Interface" | "Namespace" | "Enum", description: string, properties: Property[]) {
            super(name, type, undefined, true);
            this.description = description;
            this.properties = properties;
        }

        public propertiesList(indent = 1): string {
            return this.properties.map(p => `${" ".repeat(indent)}- [${p.displayName}](#${p.anchorName})`).join("\n");
        }

        public override content(config: Config, schema: Schema): string {
            return `${this.description}${["Interface", "Class", "Enum"].includes(this.type) ? `\n\n${this.properties.map(p => " - " + p.inlineContent(config, schema)).join("\n")}` : ""}`;
        }

        public inlineContent(): string {
            return `${this.description}\n\n${this.propertiesList(2)}`;
        }
    }
}

export default DocSchema;
