import Schema from "../gen/Schema";
/**
 * A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)
 * @class
 */
declare class Cloudnode {
    #private;
    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [options] Options for the API client
     */
    constructor(token?: string, options?: Partial<Cloudnode.Options>);
    /**
     * Get another page of paginated results
     * @param response Response to get a different page of
     * @param page Page to get
     * @returns The new page or null if the page is out of bounds
     * @throws {Cloudnode.Error} Error returned by the API
     */
    getPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>, page: number): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null>;
    /**
     * Get next page of paginated results
     * @param response Response to get the next page of
     * @returns The next page or null if this is the last page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    getNextPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null>;
    /**
     * Get previous page of paginated results
     * @param response Response to get the previous page of
     * @returns The previous page or null if this is the first page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    getPreviousPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null>;
    /**
     * Get all other pages of paginated results and return the complete data
     * > **Warning:** Depending on the amount of data, this can take a long time and use a lot of memory.
     * @param response Response to get all pages of
     * @returns All of the data in 1 page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    getAllPages<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.PaginatedData<T>>;
    newsletter: {
        /**
         * List newsletters
         * @GET /newsletter
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2???? (4294967296).
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly list: (limit?: number, page?: number) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>>;
        /**
         * Get newsletter
         * @GET /newsletter/:id
         * @param id A newsletter ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly get: (id: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Newsletter>>;
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
        readonly subscribe: (id: string, email: string, data?: Record<string, string | number | boolean>) => Promise<Cloudnode.ApiResponse<Cloudnode.NewsletterSubscription>>;
    };
    newsletters: {
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
        readonly unsubscribe: (subscription: string) => Promise<Cloudnode.ApiResponse<void>>;
        /**
         * List subscriptions of the authenticated user
         * @GET /newsletters/subscriptions
         * @param limit The number of subscriptions to return per page. No more than 50.
         * @param page The page number. No more than 2???? (4294967296).
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly listSubscriptions: (limit?: number, page?: number) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>>;
    };
    token: {
        /**
         * List tokens of user
         * @GET /token
         * @param limit The number of tokens to return per page. No more than 50.
         * @param page The page number. No more than 2???? (4294967296).
         * @param internal Internal tokens are returned as well if this parameter is present.
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly list: (limit?: number, page?: number, internal?: any) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.PartialToken[]>>>;
        /**
         * Create token
         * @POST /token
         * @param permissions List of permissions to grant to the token. You must already have each of these permissions with your current token.
         * @param lifetime Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).
         * @param note A user-specified note to label the token. Max length: 2??? (256) characters.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly create: (permissions: string[], lifetime: number, note?: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Token>>;
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
        readonly get: (id: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Token>>;
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
        readonly revoke: (id: string) => Promise<Cloudnode.ApiResponse<void>>;
    };
    tokens: {
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
        readonly refresh: () => Promise<Cloudnode.ApiResponse<Cloudnode.Token>>;
    };
}
declare namespace Cloudnode {
    /**
     * An API error response.
     */
    interface Error {
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
    interface NewsletterData {
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
    interface Newsletter {
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
    interface NewsletterSubscription {
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
    interface DatedNewsletterSubscription {
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
    interface PartialToken {
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
    interface Token {
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
    interface TokenMetadata {
        /**
         * A user-supplied note for this token
         */
        note: string | undefined;
    }
    /**
     * Paginated response
     */
    interface PaginatedData<T> {
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
    class RawResponse {
        /**
         * The headers returned by the server.
         * @readonly
         */
        readonly headers: Record<string, string>;
        /**
         * A boolean indicating whether the response was successful (status in the range `200` ??? `299`) or not.
         */
        readonly ok: boolean;
        /**
         * Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry).
         */
        readonly redirected: boolean;
        /**
         * The status code of the response.
         * @readonly
         */
        readonly status: number;
        /**
         * The status message corresponding to the status code. (e.g., `OK` for `200`).
         * @readonly
         */
        readonly statusText: string;
        /**
         * The URL of the response.
         */
        readonly url: URL;
        /**
         * The request params
         * @readonly
         */
        readonly request: {
            readonly operation: Schema.Operation;
            readonly pathParams: Record<string, string>;
            readonly queryParams: Record<string, string>;
            readonly body: any;
        };
        constructor(response: import("node-fetch").Response, request: {
            operation: Schema.Operation;
            pathParams: Record<string, string>;
            queryParams: Record<string, string>;
            body: any;
        });
    }
    namespace R {
        class ApiResponse {
            #private;
            constructor(response: RawResponse);
            /**
             * API response
             * @readonly
             */
            get _response(): RawResponse;
        }
    }
    type ApiResponse<T> = T & R.ApiResponse;
    function makeApiResponse<T>(data: T, response: RawResponse): ApiResponse<T>;
    /**
     * API client options
     */
    interface Options {
        /**
         * The base URL of the API
         */
        baseUrl: string;
        /**
         * Whether to automatically retry requests that fail temporarily.
         * If enabled, when a request fails due to a temporary error, such as a rate limit, the request will be retried after the specified delay.
         */
        autoRetry: boolean;
        /**
         * The maximum number of seconds that is acceptable to wait before retrying a failed request.
         * This requires {@link Options.autoRetry} to be enabled.
         */
        maxRetryDelay: number;
        /**
         * The maximum number of times to retry a failed request.
         * This requires {@link Options.autoRetry} to be enabled.
         */
        maxRetries: number;
    }
}
export default Cloudnode;
