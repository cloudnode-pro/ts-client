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
     * @internal
     * @private
     */
    async #sendRequest<T>(operation: Schema.Operation, pathParams: Record<string, string>, queryParams: Record<string, string>, body?: any): Promise<Cloudnode.ApiResponse<T>> {
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
            if (typeof body !== "string") {
                options.body = JSON.stringify(body);
                options.headers["Content-Type"] = "application/json";
            }
            else {
                options.body = body;
                options.headers["Content-Type"] = "text/plain";
            }
        }
        if (this.#token && operation.token !== undefined)
            options.headers["Authorization"] = `Bearer ${this.#token}`;
        if (operation.token !== undefined)
            options.credentials = "include";
        const response = await fetch(url.toString(), options);
        if (response.status === 204) return undefined as any;
        const text = await response.text();
        let data: T;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            data = JSON.parse(text, (key, value) => {
                // parse dates
                if (/^\d{4}-\d{2}-\d{2}T(?:\d{2}:){2}\d{2}(?:\.\d+)?(?:[a-zA-Z]+|\+\d{2}:\d{2})?$/.test(value))
                    return new Date(value);
                return value;
            });
        }
        else data = text as any;
        const res = Cloudnode.makeApiResponse(data, new Cloudnode.RawResponse(response, {operation, pathParams, queryParams, body} as const));
        if (response.ok) return res;
        else throw res;
    }

    /**
     * Get another page of paginated results
     * @param response Response to get a different page of
     * @param page Page to get
     * @returns The new page or null if the page is out of bounds
     */
    async getPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>, page: number): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null> {
        if (page * response.limit > response.total || page < 1) return null;
        const query = Object.assign({}, response._response.request.queryParams);
        query.page = page.toString();
        return await this.#sendRequest(response._response.request.operation, response._response.request.pathParams, query, response._response.request.body);
    }

    /**
     * Get next page of paginated results
     * @param response Response to get the next page of
     * @returns The next page or null if this is the last page
     */
    async getNextPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null> {
        return await this.getPage(response, response.page + 1);
    }

    /**
     * Get previous page of paginated results
     * @param response Response to get the previous page of
     * @returns The previous page or null if this is the first page
     */
    async getPreviousPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null> {
        return await this.getPage(response, response.page - 1);
    }

    /**
     * Get all other pages of paginated results and return the complete data
     * > **Warning:** Depending on the amount of data, this can take a long time and use a lot of memory.
     * @param response Response to get all pages of
     * @returns All pages of data
     */
    async getAllPages<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.PaginatedData<T>> {
        const pages: (true | null)[] = new Array(Math.ceil(response.total / response.limit)).fill(null);
        pages[response.page - 1] = true;
        const promises: (Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null> | true)[] = pages.map((page, i) => page === null ? this.getPage(response, i + 1) : true);
        const newPages = await Promise.all(promises.filter(page => page !== true));
        newPages.splice(response.page - 1, 0, response);
        const allPages = newPages.filter(p => p !== null) as Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>[];
        return {
            items: allPages.map(p => p.items).flat(),
            total: response.total,
            limit: response.limit,
            page: 1
        };
    }

    public newsletter = {
        /**
         * List newsletters
         * @GET /newsletter
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         list: async (limit: number = 10, page: number = 1): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>({"type":"operation","description":"List newsletters","method":"GET","path":"/newsletter","parameters":{"query":{"limit":{"description":"The number of newsletters to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"Newsletter[]"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
         },
        /**
         * Get newsletter
         * @GET /newsletter/:id
         * @param id A newsletter ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         get: async (id: string): Promise<Cloudnode.ApiResponse<Cloudnode.Newsletter>> => {
            return await this.#sendRequest<Cloudnode.Newsletter>({"type":"operation","description":"Get newsletter","method":"GET","path":"/newsletter/:id","parameters":{"path":{"id":{"description":"A newsletter ID","type":"string","required":true}}},"returns":[{"status":200,"type":"Newsletter"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
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
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         subscribe: async (id: string, email: string, data?: Record<string, string | number | boolean>): Promise<Cloudnode.ApiResponse<Cloudnode.NewsletterSubscription>> => {
            return await this.#sendRequest<Cloudnode.NewsletterSubscription>({"type":"operation","description":"Subscribe to newsletter","method":"POST","path":"/newsletter/:id/subscribe","parameters":{"path":{"id":{"description":"A newsletter ID","type":"string","required":true}},"body":{"email":{"description":"Subscriber's email address","type":"string","required":true},"data":{"description":"Additional data that this newsletter requires","type":"Record<string, string | number | boolean>","required":false}}},"returns":[{"status":201,"type":"NewsletterSubscription"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":409,"type":"Error & {code: \"CONFLICT\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {email, data});
         },
    } as const;
    public newsletters = {
        /**
         * Revoke a subscription (unsubscribe)
         * @POST /newsletters/unsubscribe
         * @param subscription The ID of the subscription to revoke
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         unsubscribe: async (subscription: string): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Revoke a subscription (unsubscribe)","method":"POST","path":"/newsletters/unsubscribe","parameters":{"body":{"subscription":{"description":"The ID of the subscription to revoke","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {subscription});
         },
        /**
         * List subscriptions of the authenticated user
         * @GET /newsletters/subscriptions
         * @param limit The number of subscriptions to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         listSubscriptions: async (limit: number = 10, page: number = 1): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>({"type":"operation","description":"List subscriptions of the authenticated user","token":"newsletter.subscriptions.list.own","method":"GET","path":"/newsletters/subscriptions","parameters":{"query":{"limit":{"description":"The number of subscriptions to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"DatedNewsletterSubscription[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
         },
    } as const;
    public token = {
        /**
         * List tokens of user
         * @GET /token
         * @param limit The number of tokens to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @param internal Internal tokens are returned as well if this parameter is present.
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         list: async (limit: number = 10, page: number = 1, internal?: any): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.PartialToken[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.PartialToken[]>>({"type":"operation","description":"List tokens of user","token":"tokens.list.own","method":"GET","path":"/token","parameters":{"query":{"limit":{"description":"The number of tokens to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false},"internal":{"description":"Internal tokens are returned as well if this parameter is present.","type":"any","required":false}}},"returns":[{"status":200,"type":"PartialToken[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`, internal: `${internal}`}, {});
         },
        /**
         * Create token
         * @POST /token
         * @param permissions List of permissions to grant to the token. You must already have each of these permissions with your current token.
         * @param lifetime Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).
         * @param note A user-specified note to label the token. Max length: 2⁸ (256) characters.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         create: async (permissions: string[], lifetime: number, note?: string): Promise<Cloudnode.ApiResponse<Cloudnode.Token>> => {
            return await this.#sendRequest<Cloudnode.Token>({"type":"operation","description":"Create token","token":"tokens.create.own","method":"POST","path":"/token","parameters":{"body":{"permissions":{"description":"List of permissions to grant to the token. You must already have each of these permissions with your current token.","type":"string[]","required":true},"lifetime":{"description":"Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).","type":"number","required":true},"note":{"description":"A user-specified note to label the token. Max length: 2⁸ (256) characters.","type":"string","required":false}}},"returns":[{"status":201,"type":"Token"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {permissions, lifetime, note});
         },
        /**
         * Get token details
         * @GET /token/:id
         * @param id The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         get: async (id: string): Promise<Cloudnode.ApiResponse<Cloudnode.Token>> => {
            return await this.#sendRequest<Cloudnode.Token>({"type":"operation","description":"Get token details","token":"tokens.get.own","method":"GET","path":"/token/:id","parameters":{"path":{"id":{"description":"The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.","type":"string","required":true}}},"returns":[{"status":200,"type":"Token"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
        /**
         * Revoke token
         * @DELETE /token/:id
         * @param id The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "MODIFICATION_NOT_ALLOWED"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         revoke: async (id: string): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Revoke token","token":"tokens.revoke.own","method":"DELETE","path":"/token/:id","parameters":{"path":{"id":{"description":"The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":400,"type":"Error & {code: \"MODIFICATION_NOT_ALLOWED\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
    } as const;
    public tokens = {
        /**
         * Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely.
         * @POST /token/refresh
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         refresh: async (): Promise<Cloudnode.ApiResponse<Cloudnode.Token>> => {
            return await this.#sendRequest<Cloudnode.Token>({"type":"operation","description":"Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely.","token":"token.refresh","method":"POST","path":"/token/refresh","parameters":{},"returns":[{"status":201,"type":"Token"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {});
         },
    } as const;

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
    /**
     * A token, however, the `permissions` field is not included
     */
    export interface PartialToken {
        /**
         * The ID or key of the token
         */
        id: string;
        /**
         * Date and time when this token was created
         */
        created: Date;
        /**
         * Date and time when this token expires. Null if it never expires.
         */
        expires: Date | null;
        /**
         * Whether this token is for internal use only, e.g. to power a session. In other words, an internal token is one that was **not** created by the client.
         */
        internal: string | undefined;
        /**
         * Additional metadata about this token
         */
        metadata: Cloudnode.TokenMetadata;
    }
    /**
     * An authentication token
     */
    export interface Token {
        /**
         * The ID or key of the token
         */
        id: string;
        /**
         * Date and time when this token was created
         */
        created: Date;
        /**
         * Date and time when this token expires. Null if it never expires.
         */
        expires: Date | null;
        /**
         * Permission scopes that this token holds
         */
        permissions: string[];
        /**
         * Whether this token is for internal use only, e.g. to power a session. In other words, an internal token is one that was **not** created by the client.
         */
        internal: string | undefined;
        /**
         * Additional metadata about this token
         */
        metadata: Cloudnode.TokenMetadata;
    }
    /**
     * Token metadata
     */
    export interface TokenMetadata {
        /**
         * A user-supplied note for this token
         */
        note: string | undefined;
    }

    /**
     * Paginated response
     */
    export interface PaginatedData<T> {
        /**
         * The page items
         */
        items: T[];
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

    export class RawResponse {
        /**
         * The headers returned by the server.
         * @readonly
         */
        public readonly headers: Record<string, string>;

        /**
         * A boolean indicating whether the response was successful (status in the range `200` – `299`) or not.
         */
        public readonly ok: boolean

        /**
         * Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry).
         */
        public readonly redirected: boolean;

        /**
         * The status code of the response.
         * @readonly
         */
        public readonly status: number;

        /**
         * The status message corresponding to the status code. (e.g., `OK` for `200`).
         * @readonly
         */
        public readonly statusText: string;

        /**
         * The URL of the response.
         */
        public readonly url: URL;

        /**
         * The request params
         * @readonly
         */
        public readonly request: {
            readonly operation: Schema.Operation;
            readonly pathParams: Record<string, string>;
            readonly queryParams: Record<string, string>;
            readonly body: any;
        };

        public constructor(response: import("node-fetch").Response, request: {operation: Schema.Operation, pathParams: Record<string, string>, queryParams: Record<string, string>, body: any}) {
            this.headers = Object.fromEntries(response.headers.entries());
            this.ok = response.ok;
            this.redirected = response.redirected;
            this.status = response.status;
            this.statusText = response.statusText;
            this.url = new URL(response.url);
            this.request = request;
        }
    }

    namespace R {
        export class ApiResponse {
            /**
             * API response
             * @readonly
             * @private
             */
            readonly #response: RawResponse;

            public constructor(response: RawResponse) {
                this.#response = response;
            }

            /**
             * API response
             * @readonly
             */
            public get _response(): RawResponse {
                return this.#response;
            }
        }
    }

    export type ApiResponse<T> = T & R.ApiResponse;

    export function makeApiResponse<T>(data: T, response: RawResponse): ApiResponse<T> {
        return Object.assign(new R.ApiResponse(response), data);
    }
}

export default Cloudnode;
