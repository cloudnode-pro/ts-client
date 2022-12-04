/**
 * A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)
 * @class
 */
declare class Cloudnode {
    #private;
    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [baseUrl="https://api.cloudnode.pro/v5/"] Base URL of the API
     */
    constructor(token?: string, baseUrl?: string);
    newsletter: {
        /**
         * List newsletters
         * @GET /newsletter
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
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
         * @param page The page number. No more than 2³² (4294967296).
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
         * @param page The page number. No more than 2³² (4294967296).
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
         * @param note A user-specified note to label the token. Max length: 2⁸ (256) characters.
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
    export class RawResponse {
        /**
         * The headers returned by the server.
         * @readonly
         */
        readonly headers: Record<string, string>;
        /**
         * A boolean indicating whether the response was successful (status in the range `200` – `299`) or not.
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
        readonly url: string;
        constructor(response: import("node-fetch").Response);
    }
    class Res {
        #private;
        constructor(response: RawResponse);
        /**
         * API response
         * @readonly
         */
        get _response(): RawResponse;
    }
    export type ApiResponse<T> = T & Res;
    export function makeApiResponse<T>(data: T, response: RawResponse): ApiResponse<T>;
    export {};
}
export default Cloudnode;
