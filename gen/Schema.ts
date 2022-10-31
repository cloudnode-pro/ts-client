interface Schema {
    models: Record<string, Schema.Model>;
    operations: Record<string, Schema.Operation | Schema.Operation.Namespace>;
}

namespace Schema {
    export type Type = string | string[];

    export namespace Model {
        export interface Field {
            description: string;
            type: Schema.Type;
        }
    }

    export type Model = Record<string, Model.Field>;

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
            operations: Record<string, Operation>;
        }
    }

    export interface Operation {
        type: "operation";
        description: string;
        method: "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        parameters: {
            path?: Record<string, Operation.Parameter>;
            query?: Record<string, Operation.Parameter>;
            body?: Record<string, Operation.Parameter>;
        }
        returns: Operation.Response[];
        /**
         * Token scope required for this operation.
         *  - `undefined` - No token required.
         *  - `null` - Valid token required, any scope.
         */
        token?: string | null;
    }
}

export default Schema;
