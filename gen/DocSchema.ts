interface DocSchema {
    groups: DocSchema.Group[];
}

namespace DocSchema {
    export class Entry {
        public name: string;
        public readonly type: string;
        public readonly typeName?: string;
        public readonly isStatic?: true;

        constructor(name: string, type: string, isStatic?: true, alwaysTypeName?: true) {
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

        public get content(): string {
            return "";
        }
    }

    export class Property extends Entry {
        public readonly description: string;
        public readonly readonly?: true;

        constructor(name: string, type: string, description: string, isStatic?: true, readonly?: true) {
            super(name, type, isStatic);
            this.description = description;
            this.readonly = readonly;
        }

        public override get content(): string {
            return `${this.description}\n\n - Type: \`${this.type}\`${this.readonly ? "\n - Read-only" : ""}`;
        }

        public get inlineContent(): string {
            return `\`${this.name}\` \`${this.type}\` ${this.description}${this.readonly ? " (read-only)" : ""}`;
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

        public override get content(): string {
            return `${this.description}\n\n - Type: \`${this.type}\`\n - Default: \`${this.default}\`\n - Required: \`${this.required}\``;
        }

        public override get inlineContent(): string {
            return `\`${this.name}\` \`${this.type}\` ${this.description} (default: \`${this.default}\`, required: \`${this.required}\`)`;
        }
    }

    export class Method extends Property {
        public readonly params: Parameter[];
        public readonly returns?: {type: string, description?: string};
        public readonly throws: {type: string, description?: string}[];

        constructor(name: string, description: string, params: Parameter[], returns: {type: string, description?: string} | undefined, throws: {type: string, description?: string}[],  isStatic?: true) {
            super(name, "Function", description, isStatic);
            this.params = params;
            this.returns = returns;
            this.throws = throws;
            this.name = `${this.name}(${this.paramsString})`;
        }

        public get paramsString(): string {
            return this.params.map(p => !p.required || p.default ? `[${p.name}]` : p.name).join(", ");
        }

        public override get content(): string {
            return `${this.description}\n\n${this.params.map(p => ` - \`${p.name}\` \`${p.type}\` ${p.description}${p.description.endsWith(".") ? "" : "."}${p.default ? ` Default: \`${p.default}\`` : ""}`).join("\n")}\n${this.returns ? ` - Returns: \`${this.returns.type}\`${this.returns.description ? ` ${this.returns.description}` : ""}` : ""}\n${this.throws.map(t => ` - Throws: \`${t.type}\`${t.description ? ` ${t.description}` : ""}`).join("\n")}`;
        }
    }

    export class Group extends Entry {
        public readonly description: string;
        public readonly properties: (Property | Group)[];

        constructor(name: string, type: "Class" | "Interface" | "Namespace", description: string, properties: Property[]) {
            super(name, type, undefined, true);
            this.description = description;
            this.properties = properties;
        }

        public propertiesList(indent = 1): string {
            return this.properties.map(p => `${" ".repeat(indent)}- [${p.displayName}](#${p.anchorName})`).join("\n");
        }

        override get content(): string {
            return `${this.description}${this.type === "Interface" ? `\n\n${this.properties.map(p => " - " + p.inlineContent).join("\n")}` : ""}`;
        }

        public get inlineContent(): string {
            return `${this.description}\n\n${this.propertiesList(2)}`;
        }
    }
}

export default DocSchema;
