
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
    async #sendRequest(operation, pathParams, queryParams, body) {
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
        const res = Cloudnode.makeApiResponse(data, new Cloudnode.RawResponse(response));
        if (response.ok)
            return res;
        else
            throw res;
    }
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
    token = {
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
        list: async (limit = 10, page = 1, internal) => {
            return await this.#sendRequest({ "type": "operation", "description": "List tokens of user", "token": "tokens.list.own", "method": "GET", "path": "/token", "parameters": { "query": { "limit": { "description": "The number of tokens to return per page. No more than 50.", "default": "10", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false }, "internal": { "description": "Internal tokens are returned as well if this parameter is present.", "type": "any", "required": false } } }, "returns": [{ "status": 200, "type": "PartialToken[]" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, { limit: `${limit}`, page: `${page}`, internal: `${internal}` }, {});
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
        create: async (permissions, lifetime, note) => {
            return await this.#sendRequest({ "type": "operation", "description": "Create token", "token": "tokens.create.own", "method": "POST", "path": "/token", "parameters": { "body": { "permissions": { "description": "List of permissions to grant to the token. You must already have each of these permissions with your current token.", "type": "string[]", "required": true }, "lifetime": { "description": "Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).", "type": "number", "required": true }, "note": { "description": "A user-specified note to label the token. Max length: 2⁸ (256) characters.", "type": "string", "required": false } } }, "returns": [{ "status": 201, "type": "Token" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { permissions, lifetime, note });
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
        get: async (id) => {
            return await this.#sendRequest({ "type": "operation", "description": "Get token details", "token": "tokens.get.own", "method": "GET", "path": "/token/:id", "parameters": { "path": { "id": { "description": "The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.", "type": "string", "required": true } } }, "returns": [{ "status": 200, "type": "Token" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
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
        revoke: async (id) => {
            return await this.#sendRequest({ "type": "operation", "description": "Revoke token", "token": "tokens.revoke.own", "method": "DELETE", "path": "/token/:id", "parameters": { "path": { "id": { "description": "The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.", "type": "string", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 400, "type": "Error & {code: \"MODIFICATION_NOT_ALLOWED\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
        },
    };
    tokens = {
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
        refresh: async () => {
            return await this.#sendRequest({ "type": "operation", "description": "Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely.", "token": "token.refresh", "method": "POST", "path": "/token/refresh", "parameters": {}, "returns": [{ "status": 201, "type": "Token" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, {});
        },
    };
}
(function (Cloudnode) {
    class RawResponse {
        /**
         * The headers returned by the server.
         * @readonly
         */
        headers;
        /**
         * A boolean indicating whether the response was successful (status in the range `200` – `299`) or not.
         */
        ok;
        /**
         * Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry).
         */
        redirected;
        /**
         * The status code of the response.
         * @readonly
         */
        status;
        /**
         * The status message corresponding to the status code. (e.g., `OK` for `200`).
         * @readonly
         */
        statusText;
        /**
         * The URL of the response.
         */
        url;
        constructor(response) {
            this.headers = Object.fromEntries(response.headers.entries());
            this.ok = response.ok;
            this.redirected = response.redirected;
            this.status = response.status;
            this.statusText = response.statusText;
            this.url = response.url;
        }
    }
    Cloudnode.RawResponse = RawResponse;
    class Res {
        /**
         * API response
         * @readonly
         * @private
         */
        #response;
        constructor(response) {
            this.#response = response;
        }
        /**
         * API response
         * @readonly
         */
        get _response() {
            return this.#response;
        }
    }
    function makeApiResponse(data, response) {
        return Object.assign(new Res(response), data);
    }
    Cloudnode.makeApiResponse = makeApiResponse;
})(Cloudnode || (Cloudnode = {}));

