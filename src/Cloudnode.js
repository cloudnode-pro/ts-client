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
     * API client options
     * @readonly
     * @private
     */
    #options;
    /**
     * Default options
     * @readonly
     * @private
     * @static
     * @internal
     */
    static #defaultOptions = {
        baseUrl: "https://api.cloudnode.pro/v5/",
        autoRetry: true,
        maxRetryDelay: 5,
        maxRetries: 3
    };
    /**
     * API version
     */
    #apiVersion = `5.12.0`;
    /**
     * Client user agent
     */
    #userAgent = `cloudnode/2.0.0`;
    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [options] Options for the API client
     */
    constructor(token, options = Cloudnode.#defaultOptions) {
        const fullOptions = Cloudnode.#defaultOptions;
        fullOptions.baseUrl = options.baseUrl ?? Cloudnode.#defaultOptions.baseUrl;
        fullOptions.autoRetry = options.autoRetry ?? Cloudnode.#defaultOptions.autoRetry;
        fullOptions.maxRetryDelay = options.maxRetryDelay ?? Cloudnode.#defaultOptions.maxRetryDelay;
        fullOptions.maxRetries = options.maxRetries ?? Cloudnode.#defaultOptions.maxRetries;
        this.#token = token;
        this.#options = fullOptions;
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
    async #sendRawRequest(operation, pathParams, queryParams, body) {
        const url = new URL(operation.path.replace(/^\/+/, ""), this.#options.baseUrl);
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
        options.headers["User-Agent"] = this.#userAgent;
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
            data = JSON.parse(text, (_key, value) => {
                // parse dates
                if (/^\d{4}-\d{2}-\d{2}T(?:\d{2}:){2}\d{2}(?:\.\d+)?(?:[a-zA-Z]+|\+\d{2}:\d{2})?$/.test(value))
                    return new Date(value);
                return value;
            });
        }
        else
            data = text;
        const res = Cloudnode.makeApiResponse(data, new Cloudnode.RawResponse(response, { operation, pathParams, queryParams, body }));
        if (response.ok)
            return res;
        else
            throw res;
    }
    /**
     * Send a request to the API with support for auto-retry
     * @param operation The operation to call
     * @param pathParams Path parameters to use in the request
     * @param queryParams Query parameters to use in the request
     * @param options API client options. Overrides the client's options
     * @internal
     * @private
     */
    #sendRequest(operation, pathParams, queryParams, body, options) {
        return new Promise(async (resolve, reject) => {
            const send = (i = 0) => {
                this.#sendRawRequest(operation, pathParams, queryParams, body)
                    .then(response => resolve(response))
                    .catch(e => {
                    options ??= this.#options;
                    options.baseUrl ??= this.#options.baseUrl;
                    options.autoRetry ??= this.#options.autoRetry;
                    options.maxRetries ??= this.#options.maxRetries;
                    options.maxRetryDelay ??= this.#options.maxRetryDelay;
                    if (options.autoRetry && i < options.maxRetries && e instanceof Cloudnode.R.ApiResponse) {
                        const res = e;
                        const retryAfter = Number(res._response.status !== 429 ? res._response.headers["x-retry-after"] ?? res._response.headers["retry-after"] : res._response.headers["x-ratelimit-reset"] ?? res._response.headers["x-rate-limit-reset"] ?? res._response.headers["ratelimit-reset"] ?? res._response.headers["rate-limit-reset"] ?? res._response.headers["retry-after"] ?? res._response.headers["x-retry-after"]);
                        if (Number.isNaN(retryAfter) || retryAfter > options.maxRetryDelay)
                            return reject(e);
                        setTimeout(send, Number(retryAfter) * 1000, ++i);
                    }
                    else
                        reject(e);
                });
            };
            send(0);
        });
    }
    /**
     * Compare versions to determine compatibility
     * @param a First version
     * @param b Second version
     */
    #compareVersions(a, b) {
        const partsA = a.split(".");
        const partsB = b.split(".");
        const verA = [partsA[0] || "0", partsA[1] || "0"];
        const verB = [partsB[0] || "0", partsB[1] || "0"];
        if (verA[0] !== verB[0])
            return "incompatible";
        if (verA[1] !== verB[1])
            return "outdated";
        return "compatible";
    }
    /**
     * Check compatibility with the API
     * @returns `compatible` - versions are fully compatible (only patch version may differ), `outdated` - compatible, but new features unavailable (minor version differs), `incompatible` - breaking changes (major version differs)
     */
    async checkCompatibility() {
        const data = await (await fetch(new URL("../", this.#options.baseUrl).toString(), {
            method: "GET",
            headers: {
                "User-Agent": this.#userAgent
            }
        })).json();
        return this.#compareVersions(data.version, this.#apiVersion);
    }
    /**
     * Get another page of paginated results
     * @param response Response to get a different page of
     * @param page Page to get
     * @returns The new page or null if the page is out of bounds
     * @throws {Cloudnode.Error} Error returned by the API
     */
    async getPage(response, page) {
        if (page * response.limit > response.total || page < 1)
            return null;
        const query = Object.assign({}, response._response.request.queryParams);
        query.page = page.toString();
        return await this.#sendRequest(response._response.request.operation, response._response.request.pathParams, query, response._response.request.body);
    }
    /**
     * Get next page of paginated results
     * @param response Response to get the next page of
     * @returns The next page or null if this is the last page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    async getNextPage(response) {
        return await this.getPage(response, response.page + 1);
    }
    /**
     * Get previous page of paginated results
     * @param response Response to get the previous page of
     * @returns The previous page or null if this is the first page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    async getPreviousPage(response) {
        return await this.getPage(response, response.page - 1);
    }
    /**
     * Get all other pages of paginated results and return the complete data
     * > **Warning:** Depending on the amount of data, this can take a long time and use a lot of memory.
     * @param response Response to get all pages of
     * @returns All of the data in 1 page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    async getAllPages(response) {
        const pages = new Array(Math.ceil(response.total / response.limit)).fill(null);
        pages[response.page - 1] = true;
        const promises = pages.map((page, i) => page === null ? this.getPage(response, i + 1) : true);
        const newPages = await Promise.all(promises.filter(page => page !== true));
        newPages.splice(response.page - 1, 0, response);
        const allPages = newPages.filter(p => p !== null);
        return {
            items: allPages.map(p => p.items).flat(),
            total: response.total,
            limit: response.limit,
            page: 1
        };
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
            return await this.#sendRequest({ "type": "operation", "description": "Get token details", "token": "tokens.get.own", "method": "GET", "path": "/token/:id", "parameters": { "path": { "id": { "description": "The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.", "type": "string | \"current\"", "required": true } } }, "returns": [{ "status": 200, "type": "Token" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
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
            return await this.#sendRequest({ "type": "operation", "description": "Revoke token", "token": "tokens.revoke.own", "method": "DELETE", "path": "/token/:id", "parameters": { "path": { "id": { "description": "The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.", "type": "string | \"current\"", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 400, "type": "Error & {code: \"MODIFICATION_NOT_ALLOWED\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
        },
        /**
         * Get list of recent requests made with the token
         * @GET /token/:id/requests
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
        listRequests: async (id, limit = 10, page = 1) => {
            return await this.#sendRequest({ "type": "operation", "description": "Get list of recent requests made with the token", "token": "tokens.get.own.requests", "method": "GET", "path": "/token/:id/requests", "parameters": { "path": { "id": { "description": "The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.", "type": "string | \"current\"", "required": true } }, "query": { "limit": { "description": "The number of requests to return per page. No more than 50.", "default": "10", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false } } }, "returns": [{ "status": 200, "type": "ShortRequest[]" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, { limit: `${limit}`, page: `${page}` }, {});
        },
        /**
         * Get a recent request by ID
         * @GET /token/:id/requests/:request
         * @param id The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.
         * @param request The ID of the request.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        getRequest: async (id, request) => {
            return await this.#sendRequest({ "type": "operation", "description": "Get a recent request by ID", "token": "tokens.get.own.requests", "method": "GET", "path": "/token/:id/requests/:request", "parameters": { "path": { "id": { "description": "The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.", "type": "string | \"current\"", "required": true }, "request": { "description": "The ID of the request.", "type": "string", "required": true } } }, "returns": [{ "status": 200, "type": "Request" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}`, request: `${request}` }, {}, {});
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
    auth = {
        /**
         * Create an account and session. After signing up, a welcome e-mail is sent to confirm your e-mail address.

> **Note**: Registering an account can only be performed from residential IP. Proxying this endpoint will likely not work. Creating multiple/alternate accounts is not allowed as per the Terms of Service.
         * @POST /auth/register
         * @param username The username to use for the account. Must be between 3 and 32 characters long. Cannot start with `user_`. May contain only letters, numbers, dashes and underscores. Must be unique.
         * @param email The e-mail address to register. A valid unique non-disposable e-mail that can receive mail is required.
         * @param password The password to use for the account. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "IP_REJECTED"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         * @returns Session token. Also returned in `Set-Cookie` header.
         */
        register: async (username, email, password) => {
            return await this.#sendRequest({ "type": "operation", "description": "Create an account and session. After signing up, a welcome e-mail is sent to confirm your e-mail address.\n\n> **Note**: Registering an account can only be performed from residential IP. Proxying this endpoint will likely not work. Creating multiple/alternate accounts is not allowed as per the Terms of Service.", "method": "POST", "path": "/auth/register", "token": null, "parameters": { "body": { "username": { "description": "The username to use for the account. Must be between 3 and 32 characters long. Cannot start with `user_`. May contain only letters, numbers, dashes and underscores. Must be unique.", "type": "string", "required": true }, "email": { "description": "The e-mail address to register. A valid unique non-disposable e-mail that can receive mail is required.", "type": "string", "required": true }, "password": { "description": "The password to use for the account. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.", "type": "string", "required": true } } }, "returns": [{ "status": 201, "type": "{session: string}", "description": "Session token. Also returned in `Set-Cookie` header." }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 403, "type": "Error & {code: \"IP_REJECTED\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { username, email, password });
        },
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
        login: async (user, password) => {
            return await this.#sendRequest({ "type": "operation", "description": "Create a session using user ID/username/e-mail and password.\n\n> **Note**: Logging in can only be performed from residential IP. Proxying this endpoint will likely not work. It is normally not recommended to use this endpoint to gain API access. Instead, create a token from your account to use with the API.", "method": "POST", "path": "/auth/login", "token": null, "parameters": { "body": { "user": { "description": "User ID (starts with `user_`), username or e-mail address.", "type": "string", "required": true }, "password": { "description": "The password of the account.", "type": "string", "required": true } } }, "returns": [{ "status": 201, "type": "{session: string}", "description": "Session token. Also returned in `Set-Cookie` header." }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 403, "type": "Error & {code: \"IP_REJECTED\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { user, password });
        },
    };
    account = {
        /**
         * Get account details
         * @GET /account
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        get: async () => {
            return await this.#sendRequest({ "type": "operation", "description": "Get account details", "token": "account.details", "method": "GET", "path": "/account", "parameters": {}, "returns": [{ "status": 200, "type": "AccountDetails" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, {});
        },
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
        getIdentity: async () => {
            return await this.#sendRequest({ "type": "operation", "description": "Get account identity", "token": "account.details.identity", "method": "GET", "path": "/account/identity", "parameters": {}, "returns": [{ "status": 200, "type": "AccountIdentity" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, {});
        },
        /**
         * Update account identity
         * @PATCH /account/identity
         * @param username Your unique username. Between 3 and 64 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.
         * @param name Your full name. Set to `null` to remove.
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
        updateIdentity: async (username, name) => {
            return await this.#sendRequest({ "type": "operation", "description": "Update account identity", "token": "account.details.identity.update", "method": "PATCH", "path": "/account/identity", "parameters": { "body": { "username": { "description": "Your unique username. Between 3 and 64 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.", "type": "string", "required": true }, "name": { "description": "Your full name. Set to `null` to remove.", "type": "string | null", "required": false } } }, "returns": [{ "status": 200, "type": "AccountIdentity" }, { "status": 204, "type": "void", "description": "`void` if nothing was changed." }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 409, "type": "Error & {code: \"CONFLICT\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { username, name });
        },
        /**
         * Replace account identity
         * @PUT /account/identity
         * @param username Your unique username. Between 3 and 64 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.
         * @param name Your full name. Set to `null` to remove.
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "CONFLICT"}}
         * @throws {Cloudnode.Error & {code: "INVALID_DATA"}}
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        replaceIdentity: async (username, name) => {
            return await this.#sendRequest({ "type": "operation", "description": "Replace account identity", "token": "account.details.identity.update", "method": "PUT", "path": "/account/identity", "parameters": { "body": { "username": { "description": "Your unique username. Between 3 and 64 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.", "type": "string", "required": true }, "name": { "description": "Your full name. Set to `null` to remove.", "type": "string | null", "required": true } } }, "returns": [{ "status": 200, "type": "AccountIdentity" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 409, "type": "Error & {code: \"CONFLICT\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { username, name });
        },
        /**
         * List account e-mail addresses
         * @GET /account/email
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        listEmails: async () => {
            return await this.#sendRequest({ "type": "operation", "description": "List account e-mail addresses", "token": "account.details.email.list", "method": "GET", "path": "/account/email", "parameters": {}, "returns": [{ "status": 200, "type": "AccountEmail[]" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, {});
        },
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
        getEmail: async () => {
            return await this.#sendRequest({ "type": "operation", "description": "Get your primary e-mail address", "token": "account.details.email", "method": "GET", "path": "/account/email/primary", "parameters": {}, "returns": [{ "status": 200, "type": "DatedPrimaryEmail" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, {});
        },
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
        setEmail: async (email) => {
            return await this.#sendRequest({ "type": "operation", "description": "Set your primary e-mail address", "token": "account.details.email.update", "method": "PUT", "path": "/account/email/primary", "parameters": { "body": { "email": { "description": "E-mail address to set as primary.", "type": "string", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 409, "type": "Error & {code: \"CONFLICT\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { email });
        },
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
        changePassword: async (currentPassword, newPassword) => {
            return await this.#sendRequest({ "type": "operation", "description": "Change account password", "token": "account.details.password.update", "method": "PUT", "path": "/account/password", "parameters": { "body": { "currentPassword": { "description": "Your current password.", "type": "string", "required": true }, "newPassword": { "description": "The new password. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.", "type": "string", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { currentPassword, newPassword });
        },
        /**
         * List account permissions with user-friendly descriptions. Some permissions (such as wildcard ones) may be excluded in this list if they don't have a description.
         * @GET /account/permissions
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
        listPermissions: async () => {
            return await this.#sendRequest({ "type": "operation", "description": "List account permissions with user-friendly descriptions. Some permissions (such as wildcard ones) may be excluded in this list if they don't have a description.", "token": "account.details", "method": "GET", "path": "/account/permissions", "parameters": {}, "returns": [{ "status": 200, "type": "Permission[]" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, {});
        },
    };
    projects = {
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
        list: async (limit = 20, page = 1) => {
            return await this.#sendRequest({ "type": "operation", "description": "List projects", "token": "projects.get.own", "method": "GET", "path": "/projects", "parameters": { "query": { "limit": { "description": "The number of projects to return per page. No more than 100.", "default": "20", "type": "number", "required": false }, "page": { "description": "The page number. No more than 2³² (4294967296).", "default": "1", "type": "number", "required": false } } }, "returns": [{ "status": 200, "type": "Project[]" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, { limit: `${limit}`, page: `${page}` }, {});
        },
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
        create: async (name) => {
            return await this.#sendRequest({ "type": "operation", "description": "Create a project", "token": "projects.create.own", "method": "POST", "path": "/projects", "parameters": { "body": { "name": { "description": "Project name. Max 255 characters.", "type": "string", "required": true } } }, "returns": [{ "status": 201, "type": "Project" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, {}, {}, { name });
        },
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
        get: async (id) => {
            return await this.#sendRequest({ "type": "operation", "description": "Get a project", "token": "projects.get.own", "method": "GET", "path": "/projects/:id", "parameters": { "path": { "id": { "description": "Project ID", "type": "string", "required": true } } }, "returns": [{ "status": 200, "type": "Project" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
        },
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
        update: async (id, name) => {
            return await this.#sendRequest({ "type": "operation", "description": "Update a project", "token": "projects.update.own", "method": "PATCH", "path": "/projects/:id", "parameters": { "path": { "id": { "description": "Project ID", "type": "string", "required": true } }, "body": { "name": { "description": "Project name. Max 255 characters.", "type": "string", "required": true } } }, "returns": [{ "status": 200, "type": "Project" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 422, "type": "Error & {code: \"INVALID_DATA\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, { name });
        },
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
        delete: async (id) => {
            return await this.#sendRequest({ "type": "operation", "description": "Delete a project", "token": "projects.delete.own", "method": "DELETE", "path": "/projects/:id", "parameters": { "path": { "id": { "description": "Project ID", "type": "string", "required": true } } }, "returns": [{ "status": 204, "type": "void" }, { "status": 404, "type": "Error & {code: \"RESOURCE_NOT_FOUND\"}" }, { "status": 401, "type": "Error & {code: \"UNAUTHORIZED\"}" }, { "status": 403, "type": "Error & {code: \"NO_PERMISSION\"}" }, { "status": 429, "type": "Error & {code: \"RATE_LIMITED\"}" }, { "status": 500, "type": "Error & {code: \"INTERNAL_SERVER_ERROR\"}" }, { "status": 503, "type": "Error & {code: \"MAINTENANCE\"}" }] }, { id: `${id}` }, {}, {});
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
        /**
         * The request params
         * @readonly
         */
        request;
        constructor(response, request) {
            this.headers = Object.fromEntries([...response.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]));
            this.ok = response.ok;
            this.redirected = response.redirected;
            this.status = response.status;
            this.statusText = response.statusText;
            this.url = new URL(response.url);
            this.request = request;
        }
    }
    Cloudnode.RawResponse = RawResponse;
    let R;
    (function (R) {
        class ApiResponse {
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
        R.ApiResponse = ApiResponse;
    })(R = Cloudnode.R || (Cloudnode.R = {}));
    function makeApiResponse(data, response) {
        return Object.assign(new R.ApiResponse(response), data);
    }
    Cloudnode.makeApiResponse = makeApiResponse;
})(Cloudnode || (Cloudnode = {}));
export default Cloudnode;
