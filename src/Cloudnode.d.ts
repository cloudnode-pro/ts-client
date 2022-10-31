declare class Cloudnode {
    #private;
    /**
     * API token to use for requests
     * @readonly
     */
    readonly token?: string;
    /**
     * Base URL of the API
     * @readonly
     */
    readonly baseUrl: string;
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
         */
        list: (limit?: number, page?: number) => Promise<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>;
        /**
         * Get newsletter
         * @GET /newsletter/:id
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         */
        get: (id: string) => Promise<Cloudnode.Newsletter>;
        /**
         * Subscribe to newsletter
         * @POST /newsletter/:id/subscribe
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         */
        subscribe: (id: string, email: string, data?: Record<string, string | number | boolean>) => Promise<Cloudnode.NewsletterSubscription>;
    };
    newsletters: {
        /**
         * Revoke a subscription (unsubscribe)
         * @POST /newsletters/unsubscribe
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         */
        unsubscribe: (subscription: string) => Promise<void>;
        /**
         * List subscriptions of the authenticated user
         * @GET /newsletters/subscriptions
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
