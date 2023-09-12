import Schema from "../gen/Schema";
/**
 * A client library for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)
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
     * Check compatibility with the API
     */
    checkCompatibility(): Promise<Cloudnode.CompatibilityStatus>;
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
    newsletters: {
        /**
         * List newsletters
         * @GET /newsletters
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly list: (limit?: number, page?: number) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>>;
        /**
         * Get newsletter
         * @GET /newsletters/:id
         * @param id A newsletter ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly get: (id: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Newsletter>>;
    };
    subscriptions: {
        /**
         * List newsletter subscriptions
         * @GET /subscriptions
         * @param limit The number of subscriptions to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly list: (limit?: number, page?: number) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>>;
        /**
         * Get newsletter subscription
         * @GET /subscriptions/:id
         * @param id The ID of the subscription to get
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly get: (id: string) => Promise<Cloudnode.ApiResponse<Cloudnode.DatedNewsletterSubscription>>;
        /**
         * Subscribe to newsletter
         * @POST /subscriptions
         * @param newsletter The ID of the newsletter to subscribe to
         * @param email Subscriber's email address
         * @param data Additional data that this newsletter requires
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly create: (newsletter: string, email: string, data?: Record<string, string | number | boolean>) => Promise<Cloudnode.ApiResponse<Cloudnode.NewsletterSubscription>>;
        /**
         * Unsubscribe from newsletter
         * @DELETE /subscriptions/:id
         * @param id The ID of the subscription to revoke
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly delete: (id: string) => Promise<Cloudnode.ApiResponse<void>>;
    };
    tokens: {
        /**
         * List tokens of user
         * @GET /tokens
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
         * @POST /tokens
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
         * @GET /tokens/:id
         * @param id The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly get: (id: string | "current") => Promise<Cloudnode.ApiResponse<Cloudnode.Token>>;
        /**
         * Revoke token
         * @DELETE /tokens/:id
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
        readonly revoke: (id: string | "current") => Promise<Cloudnode.ApiResponse<void>>;
        /**
         * Get list of recent requests made with the token
         * @GET /tokens/:id/requests
         * @param id The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.
         * @param limit The number of requests to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly listRequests: (id: string | "current", limit?: number, page?: number) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.ShortRequest[]>>>;
        /**
         * Get a recent request by ID
         * @GET /tokens/:id/requests/:request
         * @param id The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.
         * @param request The ID of the request.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "MODIFICATION_NOT_ALLOWED"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly getRequest: (id: string | "current", request: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Request>>;
        /**
         * Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely.
         * @POST /tokens/:id
         * @param id The ID of the token to refresh. Specify `current` to refresh the token that was used to authenticate the request.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly refresh: (id: string | "current") => Promise<Cloudnode.ApiResponse<Cloudnode.Token>>;
    };
    auth: {
        /**
         * Create an account and session. After signing up, a welcome e-mail is sent to confirm your e-mail address.

> **Note**: Registering an account can only be performed from residential IP. Proxying this endpoint will likely not work. Creating multiple/alternate accounts is not allowed as per the Terms of Service.
         * @POST /auth/register
         * @param username The username to use for the account. Must be between 3 and 20 characters long. Cannot start with `user_`. May contain only letters, numbers, dashes and underscores. Must be unique.
         * @param email The e-mail address to register. A valid unique non-disposable e-mail that can receive mail is required.
         * @param password The password to use for the account. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "IP_REJECTED"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         * @returns Session token. Also returned in `Set-Cookie` header.
         */
        readonly register: (username: string, email: string, password: string) => Promise<Cloudnode.ApiResponse<{
            session: string;
        }>>;
        /**
         * Create a session using user ID/username/e-mail and password.

> **Note**: Logging in can only be performed from residential IP. Proxying this endpoint will likely not work. It is normally not recommended to use this endpoint to gain API access. Instead, create a token from your account to use with the API.
         * @POST /auth/login
         * @param user User ID (starts with `user_`), username or e-mail address.
         * @param password The password of the account.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "IP_REJECTED"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         * @returns Session token. Also returned in `Set-Cookie` header.
         */
        readonly login: (user: string, password: string) => Promise<Cloudnode.ApiResponse<{
            session: string;
        }>>;
    };
    account: {
        /**
         * Get account details
         * @GET /account
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly get: () => Promise<Cloudnode.ApiResponse<Cloudnode.AccountDetails>>;
        /**
         * Get account identity
         * @GET /account/identity
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly getIdentity: () => Promise<Cloudnode.ApiResponse<Cloudnode.AccountIdentity>>;
        /**
         * Update account identity
         * @PATCH /account/identity
         * @param username Your unique username. Between 3 and 20 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.
         * @param name Your full name. Set to `null` to remove. Min 2 characters, max 32. Allowed characters (lowercase as well): A–Z `',-.,` and `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞSŸ`
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         * @returns `void` if nothing was changed.
         */
        readonly updateIdentity: (username: string, name?: string | null) => Promise<Cloudnode.ApiResponse<Cloudnode.AccountIdentity | void>>;
        /**
         * Replace account identity
         * @PUT /account/identity
         * @param username Your unique username. Between 3 and 20 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.
         * @param name Your full name. Set to `null` to remove. Min 2 characters, max 32. Allowed characters (lowercase as well): A–Z `',-.,` and `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞSŸ`
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly replaceIdentity: (username: string, name: string | null) => Promise<Cloudnode.ApiResponse<Cloudnode.AccountIdentity>>;
        /**
         * List account e-mail addresses
         * @GET /account/email
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly listEmails: () => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.AccountEmail[]>>>;
        /**
         * Get your primary e-mail address
         * @GET /account/email/primary
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly getEmail: () => Promise<Cloudnode.ApiResponse<Cloudnode.DatedPrimaryEmail>>;
        /**
         * Set your primary e-mail address
         * @PUT /account/email/primary
         * @param email E-mail address to set as primary.
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly setEmail: (email: string) => Promise<Cloudnode.ApiResponse<void>>;
        /**
         * Change account password
         * @PUT /account/password
         * @param currentPassword Your current password.
         * @param newPassword The new password. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly changePassword: (currentPassword: string, newPassword: string) => Promise<Cloudnode.ApiResponse<void>>;
        /**
         * List account permissions with user-friendly descriptions. Some permissions (such as wildcard ones) may be excluded in this list if they don't have a description.
         * @GET /account/permissions
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly listPermissions: () => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Permission[]>>>;
    };
    projects: {
        /**
         * List projects
         * @GET /projects
         * @param limit The number of projects to return per page. No more than 100.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly list: (limit?: number, page?: number) => Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Project[]>>>;
        /**
         * Create a project
         * @POST /projects
         * @param name Project name. Max 255 characters.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly create: (name: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Project>>;
        /**
         * Get a project
         * @GET /projects/:id
         * @param id Project ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly get: (id: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Project>>;
        /**
         * Update a project
         * @PATCH /projects/:id
         * @param id Project ID
         * @param name Project name. Max 255 characters.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly update: (id: string, name: string) => Promise<Cloudnode.ApiResponse<Cloudnode.Project>>;
        /**
         * Delete a project
         * @DELETE /projects/:id
         * @param id Project ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        readonly delete: (id: string) => Promise<Cloudnode.ApiResponse<void>>;
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
     * Personal information associated with your account
     */
    interface AccountIdentity {
        /**
         * Your unique username
         */
        username: string;
        /**
         * Your name
         */
        name: string | null;
    }
    /**
     * Your current primary account e-mail address
     */
    interface PrimaryEmail {
        /**
         * The ID of the e-mail address
         */
        id: string;
        /**
         * Your primary e-mail address. May ben null if anonymised.
         */
        address: string | null;
        /**
         * Whether this e-mail address has been verified
         */
        verified: boolean;
    }
    /**
     * Your current primary account e-mail address with a timestamp of when it was added to your account
     */
    interface DatedPrimaryEmail {
        /**
         * The ID of the e-mail address
         */
        id: string;
        /**
         * Your e-mail address. May ben null if anonymised.
         */
        address: string | null;
        /**
         * Whether this e-mail address has been verified
         */
        verified: boolean;
        /**
         * The date and time when this e-mail address was added to your account
         */
        added: Date;
    }
    /**
     * An e-mail address you have added to your account
     */
    interface AccountEmail {
        /**
         * The ID of the e-mail address
         */
        id: string;
        /**
         * Your e-mail address. May ben null if anonymised.
         */
        address: string | null;
        /**
         * Whether this e-mail address has been verified
         */
        verified: boolean;
        /**
         * Whether this e-mail address is your primary e-mail address
         */
        primary: boolean;
        /**
         * The date and time when this e-mail address was added to your account
         */
        added: Date;
    }
    /**
     * Details about your account
     */
    interface AccountDetails {
        /**
         * Your user ID
         */
        id: string;
        /**
         * Whether you have a password set
         */
        password: boolean;
        /**
         * The name of your permission group
         */
        group: string;
        /**
         * A list of all permission that you have access to
         */
        permissions: string[];
        /**
         * Personal information associated with your account. Requires `account.details.identity` to see. Maybe be null if the account is anonymised or you don't have permission to access the account identity.
         */
        identity: AccountIdentity | null;
        /**
         * Your current primary account e-mail address. Requires `account.details.email` to see. Maybe be null if you don't have a primary e-mail address or you don't have permission to access the account's e-mail address.
         */
        email: PrimaryEmail | null;
    }
    /**
     * A permission node
     */
    interface Permission {
        /**
         * The permission node string
         */
        permission: string;
        /**
         * User-friendly description of the permission node
         */
        description: string;
        /**
         * Additional user-friendly information about the permission node
         */
        note: string | null;
        /**
         * A group/category title that can be used to group permissions together
         */
        group: string | null;
    }
    /**
     * Overview of a request
     */
    interface ShortRequest {
        /**
         * The ID of the request
         */
        id: string;
        /**
         * The request method (e.g. GET, POST, HEAD, etc.
         */
        method: string;
        /**
         * The URL scheme
         */
        scheme: "http" | "https";
        /**
         * The requested host name
         */
        host: string;
        /**
         * The request URL path
         */
        url: string;
        /**
         * The HTTP status code that was returned to this request
         */
        status: number;
        /**
         * The IP address of the client that made the request (can be both IPv4 and IPv6)
         */
        ip: string;
        /**
         * The time when the request was received
         */
        date: Date;
        /**
         * The time in milliseconds that the request took to process
         */
        responseTime: number;
        /**
         * Whether any server-side error events occurred while processing this request
         */
        hasEvents: boolean;
    }
    /**
     * A request
     */
    interface Request {
        /**
         * The ID of the request
         */
        id: string;
        /**
         * The request method (e.g. GET, POST, HEAD, etc.
         */
        method: string;
        /**
         * The URL scheme
         */
        scheme: "http" | "https";
        /**
         * The requested host name
         */
        host: string;
        /**
         * The request URL path
         */
        url: string;
        /**
         * The HTTP status code that was returned to this request
         */
        status: number;
        /**
         * The IP address of the client that made the request (can be both IPv4 and IPv6)
         */
        ip: string;
        /**
         * The time when the request was received
         */
        date: Date;
        /**
         * The time in milliseconds that the request took to process
         */
        responseTime: number;
        /**
         * Whether any server-side error events occurred while processing this request
         */
        hasEvents: boolean;
        /**
         * The request headers that were received
         */
        requestHeaders: Record<string, string> | null;
        /**
         * The request body that was received (likely parsed and formatted as JSON)
         */
        requestBody: string | null;
        /**
         * The headers that were returned by the server
         */
        responseHeaders: Record<string, string> | null;
        /**
         * The response body that was returned by the server in response to this request
         */
        responseBody: {
            type: "Buffer";
            data: number[];
        } | null;
    }
    /**
     * An isolated group of servers
     */
    interface Project {
        /**
         * The ID of the project
         */
        id: string;
        /**
         * Project name
         */
        name: string;
        /**
         * ID of the user that owns this project
         */
        user: string;
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
        constructor(response: Response, request: {
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
    /**
     * API client compatibility status
     */
    enum CompatibilityStatus {
        /**
         * Fully compatible (API patch version may differ)
         */
        COMPATIBLE = "compatible",
        /**
         * Compatible, but outdated (i.e. existing APIs will work, but you are missing out on new features).
         */
        OUTDATED = "outdated",
        /**
         * API has implemented breaking changes which are not compatible with this client.
         */
        INCOMPATIBLE = "incompatible"
    }
}
export default Cloudnode;
