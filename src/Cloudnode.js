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
    #token;
    /**
     * Base URL of the API
     * @readonly
     * @private
     */
    #baseUrl;
    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [baseUrl="https://api.cloudnode.pro/v5/"] Base URL of the API
     */
    constructor(token, baseUrl = "https://api.cloudnode.pro/v5/") {
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
    #sendRequest = async (operation, pathParams, queryParams, body) => {
        const url = new URL(operation.path.replace(/^\/+/, ""), this.#baseUrl);
        for (const [key, value] of Object.entries(pathParams))
            url.pathname = url.pathname.replaceAll(`/:${key}`, `/${value}`);
        for (const [key, value] of Object.entries(queryParams))
            url.searchParams.append(key, value);
        const options = {
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
        if (response.status === 204)
            return undefined;
        const text = await response.text();
        let data;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            data = JSON.parse(text, (key, value) => {
                // parse dates
                if (/^\d{4}-\d{2}-\d{2}T(?:\d{2}:){2}\d{2}(?:\.\d+)?(?:[a-zA-Z]+|\+\d{2}:\d{2})?$/.test(value))
                    return new Date(value);
                return value;
            });
        }
        else
            data = text;
        if (response.ok)
            return data;
        else
            throw data;
    };
    newsletter = {
        /**
         * List newsletters
         * @GET /newsletter
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        list: async (limit = 10, page = 1) => {
            return await this.#sendRequest({ "type": "operation", "description": "List newsletters", "method": "GET", "path": "/newsletter", "parameters": { "query": { "limit": { "description": "The number of newsletters to return per page. No more than 50.", "default": "10", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false } } }, "returns": [{ "status": 200, "type": "Newsletter[]" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, { limit: `${limit}`, page: `${page}` }, {});
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
        get: async (id) => {
            return await this.#sendRequest({ "type": "operation", "description": "Get newsletter", "method": "GET", "path": "/newsletter/:id", "parameters": { "path": { "id": { "description": "A newsletter ID", "type": "string", "required": true } } }, "returns": [{ "status": 200, "type": "Newsletter" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
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
        subscribe: async (id, email, data) => {
            return await this.#sendRequest({ "type": "operation", "description": "Subscribe to newsletter", "method": "POST", "path": "/newsletter/:id/subscribe", "parameters": { "path": { "id": { "description": "A newsletter ID", "type": "string", "required": true } }, "body": { "email": { "description": "Subscriber's email address", "type": "string", "required": true }, "data": { "description": "Additional data that this newsletter requires", "type": "Record<string, string | number | boolean>", "required": false } } }, "returns": [{ "status": 201, "type": "NewsletterSubscription" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 409, "type": "Error & {code: \"CONFLICT\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, { email, data });
        },
    };
    newsletters = {
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
        unsubscribe: async (subscription) => {
            return await this.#sendRequest({ "type": "operation", "description": "Revoke a subscription (unsubscribe)", "method": "POST", "path": "/newsletters/unsubscribe", "parameters": { "body": { "subscription": { "description": "The ID of the subscription to revoke", "type": "string", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { subscription });
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
        listSubscriptions: async (limit = 10, page = 1) => {
            return await this.#sendRequest({ "type": "operation", "description": "List subscriptions of the authenticated user", "token": "newsletter.subscriptions.list.own", "method": "GET", "path": "/newsletters/subscriptions", "parameters": { "query": { "limit": { "description": "The number of subscriptions to return per page. No more than 50.", "default": "10", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false } } }, "returns": [{ "status": 200, "type": "DatedNewsletterSubscription[]" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, { limit: `${limit}`, page: `${page}` }, {});
        },
    };
}
export default Cloudnode;
