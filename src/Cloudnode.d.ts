/**
 * Cloudnode v5 API TypeScript client
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
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
        list: (limit?: number, page?: number) => Promise<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>;
        /**
         * Get newsletter
         * @GET /newsletter/:id
         * @param id A newsletter ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
        get: (id: string) => Promise<Cloudnode.Newsletter>;
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
        subscribe: (id: string, email: string, data?: Record<string, string | number | boolean>) => Promise<Cloudnode.NewsletterSubscription>;
    };
    newsletters: {
        /**
         * Revoke a subscription (unsubscribe)
         * @POST /newsletters/unsubscribe
         * @param subscription The ID of the subscription to revoke
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         */
        unsubscribe: (subscription: string) => Promise<void>;
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
        listSubscriptions: (limit?: number, page?: number) => Promise<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>;
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
    interface PaginatedData<T> {
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
