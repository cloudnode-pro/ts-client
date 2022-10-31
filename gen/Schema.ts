interface Schema {
    models: Record<string, Schema.Model>;
    operations: Record<string, Schema.Operation | Schema.Operation.Namespace>;
}

namespace Schema {
    export type Type = string;

    export namespace Model {
        export interface Field {
            name: string;
            description: string;
            type: Schema.Type;
        }
    }

    export interface Model {
        description: string;
        fields: Schema.Model.Field[];
    }

    export namespace Operation {
        export interface Parameter {
            description: string;
            default?: string;
            type: Schema.Type;
            required: boolean;
        }

        export interface Response {
            status: number;
            type: Schema.Type;
        }

        export interface Namespace {
            type: "namespace";
            operations: Record<string, Schema.Operation>;
        }
    }

    export interface Operation {
        type: "operation";
        description: string;
        method: "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        parameters: {
            path?: Record<string, Schema.Operation.Parameter>;
            query?: Record<string, Schema.Operation.Parameter>;
            body?: Record<string, Schema.Operation.Parameter>;
        }
        returns: Schema.Operation.Response[];
        /**
         * Token scope required for this operation.
         *  - `undefined` - No token required.
         *  - `null` - Valid token required, any scope.
         */
        token?: string | null;
    }
}

export default Schema;
