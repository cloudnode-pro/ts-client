import Schema from "../gen/Schema";
import fetch from "node-fetch";

/**
 * A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)
 * @class
 */
class Cloudnode {
    /**
     * API token to use for requests
     * @readonly
     * @private
     */
    readonly #token?: string;

    /**
     * Base URL of the API
     * @readonly
     * @private
     */
    readonly #baseUrl: string;

    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [baseUrl="https://api.cloudnode.pro/v5/"] Base URL of the API
     */
    public constructor(token?: string, baseUrl = "https://api.cloudnode.pro/v5/") {
        this.#token = token;
        this.#baseUrl = baseUrl;
    }

    /**
     * Send a request to the API
     * @param operation The operation to call
     * @param pathParams Path parameters to use in the request
     * @param queryParams Query parameters to use in the request
     * @param body Body to use in the request
     * @private
     */
    #sendRequest = async <T>(operation: Schema.Operation, pathParams: Record<string, string>, queryParams: Record<string, string>, body?: any): Promise<T> => {
        const url = new URL(operation.path.replace(/^\/+/, ""), this.#baseUrl);
        for (const [key, value] of Object.entries(pathParams))
            url.pathname = url.pathname.replaceAll(`/:${key}`, `/${value}`);
        for (const [key, value] of Object.entries(queryParams))
            url.searchParams.append(key, value);
        const options: Record<string, any> = {
            method: operation.method,
            headers: {}
        };
        if (body && !["GET", "HEAD"].includes(operation.method)) {
            options.body = JSON.stringify(body);
            options.headers["Content-Type"] = "application/json";
        }
        if (this.#token)
            options.headers["Authorization"] = `Bearer ${this.#token}`;
        const response = await fetch(url.toString(), options);
        if (response.status === 204) return undefined as any;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            const json = await response.json();
            if (response.ok) return json as T;
            else throw json;
        }
        else {
            const text = await response.text();
            if (response.ok) return text as any;
            else throw text;
        }
    }

    public newsletter = {
        /**
         * List newsletters
         * @GET /newsletter
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
         list: async (limit: number = 10, page: number = 1): Promise<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>({"type":"operation","description":"List newsletters","method":"GET","path":"/newsletter","parameters":{"query":{"limit":{"description":"The number of newsletters to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"Newsletter[]"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
         },
        /**
         * Get newsletter
         * @GET /newsletter/:id
         * @param id A newsletter ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
         get: async (id: string): Promise<Cloudnode.Newsletter> => {
            return await this.#sendRequest<Cloudnode.Newsletter>({"type":"operation","description":"Get newsletter","method":"GET","path":"/newsletter/:id","parameters":{"path":{"id":{"description":"A newsletter ID","type":"string","required":true}}},"returns":[{"status":200,"type":"Newsletter"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"}]}, {id: `${id}`}, {}, {});
         },
        /**
         * Subscribe to newsletter
         * @POST /newsletter/:id/subscribe
         * @param id A newsletter ID
         * @param email Subscriber's email address
         * @param data Additional data that this newsletter requires
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
         subscribe: async (id: string, email: string, data?: Record<string, string | number | boolean>): Promise<Cloudnode.NewsletterSubscription> => {
            return await this.#sendRequest<Cloudnode.NewsletterSubscription>({"type":"operation","description":"Subscribe to newsletter","method":"POST","path":"/newsletter/:id/subscribe","parameters":{"path":{"id":{"description":"A newsletter ID","type":"string","required":true}},"body":{"email":{"description":"Subscriber's email address","type":"string","required":true},"data":{"description":"Additional data that this newsletter requires","type":"Record<string, string | number | boolean>","required":false}}},"returns":[{"status":201,"type":"NewsletterSubscription"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":409,"type":"Error & {code: \"CONFLICT\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"}]}, {id: `${id}`}, {}, {email: `${email}`, data: `${data}`});
         },
    }
    public newsletters = {
        /**
         * Revoke a subscription (unsubscribe)
         * @POST /newsletters/unsubscribe
         * @param subscription The ID of the subscription to revoke
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
         unsubscribe: async (subscription: string): Promise<void> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Revoke a subscription (unsubscribe)","method":"POST","path":"/newsletters/unsubscribe","parameters":{"body":{"subscription":{"description":"The ID of the subscription to revoke","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"}]}, {}, {}, {subscription: `${subscription}`});
         },
        /**
         * List subscriptions of the authenticated user
         * @GET /newsletters/subscriptions
         * @param limit The number of subscriptions to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
         listSubscriptions: async (limit: number = 10, page: number = 1): Promise<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>({"type":"operation","description":"List subscriptions of the authenticated user","token":"newsletter.subscriptions.list.own","method":"GET","path":"/newsletters/subscriptions","parameters":{"query":{"limit":{"description":"The number of subscriptions to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"DatedNewsletterSubscription[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
         },
    }

}

namespace Cloudnode {
    /**
     * An API error response.
     */
    export interface Error {
        /**
         * A human-readable description of this error
         */
        message: string;
        /**
         * Error code
         */
        code: string;
        /**
         * Affected request fields. The key is the name of the input parameter (e.g. from the request body or query string) and the value is a human-readable error message for that field.
         */
        fields: Record<string, string | Record<string, string>>;
    }
    /**
     * A data field that is required to subscribe to this newsletter
     */
    export interface NewsletterData {
        /**
         * The name of the field
         */
        name: string;
        /**
         * Description of the field
         */
        description: string | undefined;
        /**
         * The type of data
         */
        type: "string" | "number" | "boolean";
        /**
         * Whether this field is required
         */
        required: boolean;
    }
    /**
     * A newsletter that you can subscribe to
     */
    export interface Newsletter {
        /**
         * The unique identifier for this newsletter
         */
        id: string;
        /**
         * The name of this newsletter
         */
        name: string;
        /**
         * Additional data that is required to subscribe to this newsletter
         */
        data: Record<string, NewsletterData>;
    }
    /**
     * Your subscription to a newsletter
     */
    export interface NewsletterSubscription {
        /**
         * The ID of the subscription. Can be used to unsubscribe.
         */
        id: string;
        /**
         * The email address of the subscriber
         */
        email: string;
        /**
         * The ID of the newsletter that was subscribed to
         */
        newsletter: string;
    }
    /**
     * A newsletter subscription with a creation date
     */
    export interface DatedNewsletterSubscription {
        /**
         * The ID of the subscription. Can be used to unsubscribe.
         */
        id: string;
        /**
         * The email address of the subscriber
         */
        email: string;
        /**
         * The ID of the newsletter that was subscribed to
         */
        newsletter: string;
        /**
         * The date the subscription was created
         */
        date: Date;
    }

    export interface PaginatedData<T> {
        /**
         * The page items
         */
        items: T;
        /**
         * The total number of items
         */
        total: number;
        /**
         * The number of items per page
         */
        limit: number;
        /**
         * The current page number
         */
        page: number;
    }
}

export default Cloudnode;
