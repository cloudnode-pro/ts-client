class Cloudnode {
    /**
     * API token to use for requests
     * @readonly
     */
    token;
    /**
     * Base URL of the API
     * @readonly
     */
    baseUrl;
    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [baseUrl="https://api.cloudnode.pro/v5/"] Base URL of the API
     */
    constructor(token, baseUrl = "https://api.cloudnode.pro/v5/") {
        this.token = token;
        this.baseUrl = baseUrl;
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
        const url = new URL(operation.path.replace(/^\/+/, ""), this.baseUrl);
        for (const [key, value] of Object.entries(pathParams))
            url.pathname = url.pathname.replaceAll(`/:${key}`, `/${value}`);
        for (const [key, value] of Object.entries(queryParams))
            url.searchParams.append(key, value);
        const options = {
            method: operation.method,
            headers: {}
        };
        if (body && !["GET", "HEAD"].includes(operation.method)) {
            options.body = JSON.stringify(body);
            options.headers["Content-Type"] = "application/json";
        }
        if (this.token)
            options.headers["Authorization"] = `Bearer ${this.token}`;
        const response = await fetch(url.toString(), options);
        if (response.status === 204)
            return undefined;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            const json = await response.json();
            if (response.ok)
                return json;
            else
                throw json;
        }
        else {
            const text = await response.text();
            if (response.ok)
                return text;
            else
                throw text;
        }
    };
    newsletter = {
        /**
         * List newsletters
         * @GET /newsletter
         */
        list: async (limit = 10, page = 1) => {
            return await this.#sendRequest({ "type": "operation", "description": "List newsletters", "method": "GET", "path": "/newsletter", "parameters": { "query": { "limit": { "description": "The number of newsletters to return per page. No more than 50.", "default": "10", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false } } }, "returns": [{ "status": 200, "type": "Newsletter[]" }] }, {}, { limit: `${limit}`, page: `${page}` }, {});
        },
        /**
         * Get newsletter
         * @GET /newsletter/:id
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         */
        get: async (id) => {
            return await this.#sendRequest({ "type": "operation", "description": "Get newsletter", "method": "GET", "path": "/newsletter/:id", "parameters": { "path": { "id": { "description": "A newsletter ID", "type": "string", "required": true } } }, "returns": [{ "status": 200, "type": "Newsletter" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }] }, { id: `${id}` }, {}, {});
        },
        /**
         * Subscribe to newsletter
         * @POST /newsletter/:id/subscribe
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         */
        subscribe: async (id, email, data) => {
            return await this.#sendRequest({ "type": "operation", "description": "Subscribe to newsletter", "method": "POST", "path": "/newsletter/:id/subscribe", "parameters": { "path": { "id": { "description": "A newsletter ID", "type": "string", "required": true } }, "body": { "email": { "description": "Subscriber's email address", "type": "string", "required": true }, "data": { "description": "Additional data that this newsletter requires", "type": "Record<string, string | number | boolean>", "required": false } } }, "returns": [{ "status": 201, "type": "NewsletterSubscription" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 409, "type": "Error & {code: \"CONFLICT\"}" }] }, { id: `${id}` }, {}, { email: `${email}`, data: `${data}` });
        },
    };
    newsletters = {
        /**
         * Revoke a subscription (unsubscribe)
         * @POST /newsletters/unsubscribe
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         */
        unsubscribe: async (subscription) => {
            return await this.#sendRequest({ "type": "operation", "description": "Revoke a subscription (unsubscribe)", "method": "POST", "path": "/newsletters/unsubscribe", "parameters": { "body": { "subscription": { "description": "The ID of the subscription to revoke", "type": "string", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }] }, {}, {}, { subscription: `${subscription}` });
        },
        /**
         * List subscriptions of the authenticated user
         * @GET /newsletters/subscriptions
         */
        listSubscriptions: async (limit = 10, page = 1) => {
            return await this.#sendRequest({ "type": "operation", "description": "List subscriptions of the authenticated user", "token": "newsletter.subscriptions.list.own", "method": "GET", "path": "/newsletters/subscriptions", "parameters": { "query": { "limit": { "description": "The number of subscriptions to return per page. No more than 50.", "default": "10", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false } } }, "returns": [{ "status": 200, "type": "DatedNewsletterSubscription[]" }] }, {}, { limit: `${limit}`, page: `${page}` }, {});
        },
    };
}
export default Cloudnode;
