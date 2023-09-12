import Schema from "../gen/Schema";

/**
 * A client library for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)
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
     * API client options
     * @readonly
     * @private
     */
    readonly #options: Cloudnode.Options;

    /**
     * Default options
     * @readonly
     * @private
     * @static
     * @internal
     */
    static readonly #defaultOptions: Cloudnode.Options = {
        baseUrl: "https://api.cloudnode.pro/v5/",
        autoRetry: true,
        maxRetryDelay: 5,
        maxRetries: 3
    };

    /**
     * API version
     */
    readonly #apiVersion = `5.13.0`;

    /**
     * Client user agent
     */
    readonly #userAgent = `cloudnode/0.0.0-dev`;

    /**
     * Construct a new Cloudnode API client
     * @param token API token to use for requests
     * @param [options] Options for the API client
     */
    public constructor(token?: string, options: Partial<Cloudnode.Options> = Cloudnode.#defaultOptions) {
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
    async #sendRawRequest<T>(operation: Schema.Operation, pathParams: Record<string, string>, queryParams: Record<string, string>, body?: any): Promise<Cloudnode.ApiResponse<T>> {
        const url = new URL(operation.path.replace(/^\/+/, ""), this.#options.baseUrl);
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

        options.headers["User-Agent"] = this.#userAgent;

        if (this.#token && operation.token !== undefined)
            options.headers["Authorization"] = `Bearer ${this.#token}`;
        if (operation.token !== undefined)
            options.credentials = "include";
        const response = await fetch(url.toString(), options);
        if (response.status === 204) return undefined as any;
        const text = await response.text();
        let data: T;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            data = JSON.parse(text, (_key, value) => {
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
     * Send a request to the API with support for auto-retry
     * @param operation The operation to call
     * @param pathParams Path parameters to use in the request
     * @param queryParams Query parameters to use in the request
     * @param options API client options. Overrides the client's options
     * @internal
     * @private
     */
    #sendRequest<T>(operation: Schema.Operation, pathParams: Record<string, string>, queryParams: Record<string, string>, body?: any, options?: Cloudnode.Options): Promise<Cloudnode.ApiResponse<T>> {
        return new Promise(async (resolve, reject) => {
            const send = (i: number = 0) => {
                this.#sendRawRequest<T>(operation, pathParams, queryParams, body)
                    .then(response => resolve(response))
                    .catch(e => {
                        options ??= this.#options;
                        options.baseUrl ??= this.#options.baseUrl;
                        options.autoRetry ??= this.#options.autoRetry;
                        options.maxRetries ??= this.#options.maxRetries;
                        options.maxRetryDelay ??= this.#options.maxRetryDelay;

                        if (options.autoRetry && i < options.maxRetries && e instanceof Cloudnode.R.ApiResponse) {
                            const res: Cloudnode.R.ApiResponse = e;
                            const retryAfter: number = Number(res._response.status !== 429 ? res._response.headers["x-retry-after"] ?? res._response.headers["retry-after"] : res._response.headers["x-ratelimit-reset"] ?? res._response.headers["x-rate-limit-reset"] ?? res._response.headers["ratelimit-reset"] ?? res._response.headers["rate-limit-reset"] ?? res._response.headers["retry-after"] ?? res._response.headers["x-retry-after"]);
                            if (Number.isNaN(retryAfter) || retryAfter > options.maxRetryDelay) return reject(e);
                            setTimeout(send, Number(retryAfter) * 1000, ++i);
                        }
                        else reject(e);
                    });
            }
            send(0);
        });
    }

    /**
     * Compare versions to determine compatibility
     * @param a First version
     * @param b Second version
     */
    #compareVersions(a: string, b: string): Cloudnode.CompatibilityStatus {
        const partsA = a.split(".");
        const partsB = b.split(".");

        const verA = [partsA[0] || "0", partsA[1] || "0"];
        const verB = [partsB[0] || "0", partsB[1] || "0"];

        if (verA[0] !== verB[0]) return Cloudnode.CompatibilityStatus.INCOMPATIBLE;
        if (verA[1] !== verB[1]) return Cloudnode.CompatibilityStatus.OUTDATED;
        return Cloudnode.CompatibilityStatus.COMPATIBLE;
    }

    /**
     * Check compatibility with the API
     */
    public async checkCompatibility() {
        const data: any = await (await fetch(new URL("../", this.#options.baseUrl).toString(), {
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
     * @throws {Cloudnode.Error} Error returned by the API
     */
    async getNextPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null> {
        return await this.getPage(response, response.page + 1);
    }

    /**
     * Get previous page of paginated results
     * @param response Response to get the previous page of
     * @returns The previous page or null if this is the first page
     * @throws {Cloudnode.Error} Error returned by the API
     */
    async getPreviousPage<T>(response: Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>>): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<T>> | null> {
        return await this.getPage(response, response.page - 1);
    }

    /**
     * Get all other pages of paginated results and return the complete data
     * > **Warning:** Depending on the amount of data, this can take a long time and use a lot of memory.
     * @param response Response to get all pages of
     * @returns All of the data in 1 page
     * @throws {Cloudnode.Error} Error returned by the API
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

    public newsletters = {
        /**
         * List newsletters
         * @GET /newsletters
         * @param limit The number of newsletters to return per page. No more than 50.
         * @param page The page number. No more than 2³² (4294967296).
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         list: async (limit: number = 10, page: number = 1): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.Newsletter[]>>({"type":"operation","description":"List newsletters","method":"GET","path":"/newsletters","parameters":{"query":{"limit":{"description":"The number of newsletters to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"Newsletter[]"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
         },
        /**
         * Get newsletter
         * @GET /newsletters/:id
         * @param id A newsletter ID
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         get: async (id: string): Promise<Cloudnode.ApiResponse<Cloudnode.Newsletter>> => {
            return await this.#sendRequest<Cloudnode.Newsletter>({"type":"operation","description":"Get newsletter","method":"GET","path":"/newsletters/:id","parameters":{"path":{"id":{"description":"A newsletter ID","type":"string","required":true}}},"returns":[{"status":200,"type":"Newsletter"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
    } as const;
    public subscriptions = {
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
         list: async (limit: number = 10, page: number = 1): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>>({"type":"operation","description":"List newsletter subscriptions","token":"newsletter.subscriptions.list.own","method":"GET","path":"/subscriptions","parameters":{"query":{"limit":{"description":"The number of subscriptions to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"DatedNewsletterSubscription[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
         },
        /**
         * Get newsletter subscription
         * @GET /subscriptions/:id
         * @param id The ID of the subscription to get
         * @throws {Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         get: async (id: string): Promise<Cloudnode.ApiResponse<Cloudnode.DatedNewsletterSubscription>> => {
            return await this.#sendRequest<Cloudnode.DatedNewsletterSubscription>({"type":"operation","description":"Get newsletter subscription","method":"GET","path":"/subscriptions/:id","parameters":{"path":{"id":{"description":"The ID of the subscription to get","type":"string","required":true}}},"returns":[{"status":200,"type":"DatedNewsletterSubscription"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
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
         create: async (newsletter: string, email: string, data?: Record<string, string | number | boolean>): Promise<Cloudnode.ApiResponse<Cloudnode.NewsletterSubscription>> => {
            return await this.#sendRequest<Cloudnode.NewsletterSubscription>({"type":"operation","description":"Subscribe to newsletter","method":"POST","path":"/subscriptions","parameters":{"body":{"newsletter":{"description":"The ID of the newsletter to subscribe to","type":"string","required":true},"email":{"description":"Subscriber's email address","type":"string","required":true},"data":{"description":"Additional data that this newsletter requires","type":"Record<string, string | number | boolean>","required":false}}},"returns":[{"status":201,"type":"NewsletterSubscription"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":409,"type":"Error & {code: \"CONFLICT\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {newsletter, email, data});
         },
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
         delete: async (id: string): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Unsubscribe from newsletter","method":"DELETE","path":"/subscriptions/:id","parameters":{"path":{"id":{"description":"The ID of the subscription to revoke","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
    } as const;
    public tokens = {
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
         list: async (limit: number = 10, page: number = 1, internal?: any): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.PartialToken[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.PartialToken[]>>({"type":"operation","description":"List tokens of user","token":"tokens.list.own","method":"GET","path":"/tokens","parameters":{"query":{"limit":{"description":"The number of tokens to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false},"internal":{"description":"Internal tokens are returned as well if this parameter is present.","type":"any","required":false}}},"returns":[{"status":200,"type":"PartialToken[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`, internal: `${internal}`}, {});
         },
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
         create: async (permissions: string[], lifetime: number, note?: string): Promise<Cloudnode.ApiResponse<Cloudnode.Token>> => {
            return await this.#sendRequest<Cloudnode.Token>({"type":"operation","description":"Create token","token":"tokens.create.own","method":"POST","path":"/tokens","parameters":{"body":{"permissions":{"description":"List of permissions to grant to the token. You must already have each of these permissions with your current token.","type":"string[]","required":true},"lifetime":{"description":"Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).","type":"number","required":true},"note":{"description":"A user-specified note to label the token. Max length: 2⁸ (256) characters.","type":"string","required":false}}},"returns":[{"status":201,"type":"Token"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {permissions, lifetime, note});
         },
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
         get: async (id: string | "current"): Promise<Cloudnode.ApiResponse<Cloudnode.Token>> => {
            return await this.#sendRequest<Cloudnode.Token>({"type":"operation","description":"Get token details","token":"tokens.get.own","method":"GET","path":"/tokens/:id","parameters":{"path":{"id":{"description":"The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.","type":"string | \"current\"","required":true}}},"returns":[{"status":200,"type":"Token"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
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
         revoke: async (id: string | "current"): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Revoke token","token":"tokens.revoke.own","method":"DELETE","path":"/tokens/:id","parameters":{"path":{"id":{"description":"The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.","type":"string | \"current\"","required":true}}},"returns":[{"status":204,"type":"void"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":423,"type":"Error & {code: \"MODIFICATION_NOT_ALLOWED\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
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
         listRequests: async (id: string | "current", limit: number = 10, page: number = 1): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.ShortRequest[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.ShortRequest[]>>({"type":"operation","description":"Get list of recent requests made with the token","token":"tokens.get.own.requests","method":"GET","path":"/tokens/:id/requests","parameters":{"path":{"id":{"description":"The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.","type":"string | \"current\"","required":true}},"query":{"limit":{"description":"The number of requests to return per page. No more than 50.","default":"10","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"ShortRequest[]"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {limit: `${limit}`, page: `${page}`}, {});
         },
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
         getRequest: async (id: string | "current", request: string): Promise<Cloudnode.ApiResponse<Cloudnode.Request>> => {
            return await this.#sendRequest<Cloudnode.Request>({"type":"operation","description":"Get a recent request by ID","token":"tokens.get.own.requests","method":"GET","path":"/tokens/:id/requests/:request","parameters":{"path":{"id":{"description":"The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.","type":"string | \"current\"","required":true},"request":{"description":"The ID of the request.","type":"string","required":true}}},"returns":[{"status":200,"type":"Request"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":423,"type":"Error & {code: \"MODIFICATION_NOT_ALLOWED\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`, request: `${request}`}, {}, {});
         },
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
         refresh: async (id: string | "current"): Promise<Cloudnode.ApiResponse<Cloudnode.Token>> => {
            return await this.#sendRequest<Cloudnode.Token>({"type":"operation","description":"Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely.","token":"token.refresh","method":"POST","path":"/tokens/:id","parameters":{"path":{"id":{"description":"The ID of the token to refresh. Specify `current` to refresh the token that was used to authenticate the request.","type":"string | \"current\"","required":true}}},"returns":[{"status":200,"type":"Token"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
         },
    } as const;
    public auth = {
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
         register: async (username: string, email: string, password: string): Promise<Cloudnode.ApiResponse<{session: string}>> => {
            return await this.#sendRequest<{session: string}>({"type":"operation","description":"Create an account and session. After signing up, a welcome e-mail is sent to confirm your e-mail address.\n\n> **Note**: Registering an account can only be performed from residential IP. Proxying this endpoint will likely not work. Creating multiple/alternate accounts is not allowed as per the Terms of Service.","method":"POST","path":"/auth/register","token":null,"parameters":{"body":{"username":{"description":"The username to use for the account. Must be between 3 and 20 characters long. Cannot start with `user_`. May contain only letters, numbers, dashes and underscores. Must be unique.","type":"string","required":true},"email":{"description":"The e-mail address to register. A valid unique non-disposable e-mail that can receive mail is required.","type":"string","required":true},"password":{"description":"The password to use for the account. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.","type":"string","required":true}}},"returns":[{"status":201,"type":"{session: string}","description":"Session token. Also returned in `Set-Cookie` header."},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":403,"type":"Error & {code: \"IP_REJECTED\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {username, email, password});
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
         login: async (user: string, password: string): Promise<Cloudnode.ApiResponse<{session: string}>> => {
            return await this.#sendRequest<{session: string}>({"type":"operation","description":"Create a session using user ID/username/e-mail and password.\n\n> **Note**: Logging in can only be performed from residential IP. Proxying this endpoint will likely not work. It is normally not recommended to use this endpoint to gain API access. Instead, create a token from your account to use with the API.","method":"POST","path":"/auth/login","token":null,"parameters":{"body":{"user":{"description":"User ID (starts with `user_`), username or e-mail address.","type":"string","required":true},"password":{"description":"The password of the account.","type":"string","required":true}}},"returns":[{"status":201,"type":"{session: string}","description":"Session token. Also returned in `Set-Cookie` header."},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":403,"type":"Error & {code: \"IP_REJECTED\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {user, password});
         },
    } as const;
    public account = {
        /**
         * Get account details
         * @GET /account
         * @throws {Cloudnode.Error & {code: "UNAUTHORIZED"}}
         * @throws {Cloudnode.Error & {code: "NO_PERMISSION"}}
         * @throws {Cloudnode.Error & {code: "RATE_LIMITED"}}
         * @throws {Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}}
         * @throws {Cloudnode.Error & {code: "MAINTENANCE"}}
         */
         get: async (): Promise<Cloudnode.ApiResponse<Cloudnode.AccountDetails>> => {
            return await this.#sendRequest<Cloudnode.AccountDetails>({"type":"operation","description":"Get account details","token":"account.details","method":"GET","path":"/account","parameters":{},"returns":[{"status":200,"type":"AccountDetails"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {});
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
         getIdentity: async (): Promise<Cloudnode.ApiResponse<Cloudnode.AccountIdentity>> => {
            return await this.#sendRequest<Cloudnode.AccountIdentity>({"type":"operation","description":"Get account identity","token":"account.details.identity","method":"GET","path":"/account/identity","parameters":{},"returns":[{"status":200,"type":"AccountIdentity"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {});
         },
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
         updateIdentity: async (username: string, name?: string | null): Promise<Cloudnode.ApiResponse<Cloudnode.AccountIdentity | void>> => {
            return await this.#sendRequest<Cloudnode.AccountIdentity | void>({"type":"operation","description":"Update account identity","token":"account.details.identity.update","method":"PATCH","path":"/account/identity","parameters":{"body":{"username":{"description":"Your unique username. Between 3 and 20 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.","type":"string","required":true},"name":{"description":"Your full name. Set to `null` to remove. Min 2 characters, max 32. Allowed characters (lowercase as well): A–Z `',-.,` and `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞSŸ`","type":"string | null","required":false}}},"returns":[{"status":200,"type":"AccountIdentity"},{"status":204,"type":"void","description":"`void` if nothing was changed."},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":409,"type":"Error & {code: \"CONFLICT\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {username, name});
         },
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
         replaceIdentity: async (username: string, name: string | null): Promise<Cloudnode.ApiResponse<Cloudnode.AccountIdentity>> => {
            return await this.#sendRequest<Cloudnode.AccountIdentity>({"type":"operation","description":"Replace account identity","token":"account.details.identity.update","method":"PUT","path":"/account/identity","parameters":{"body":{"username":{"description":"Your unique username. Between 3 and 20 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.","type":"string","required":true},"name":{"description":"Your full name. Set to `null` to remove. Min 2 characters, max 32. Allowed characters (lowercase as well): A–Z `',-.,` and `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞSŸ`","type":"string | null","required":true}}},"returns":[{"status":200,"type":"AccountIdentity"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":409,"type":"Error & {code: \"CONFLICT\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {username, name});
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
         listEmails: async (): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.AccountEmail[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.AccountEmail[]>>({"type":"operation","description":"List account e-mail addresses","token":"account.details.email.list","method":"GET","path":"/account/email","parameters":{},"returns":[{"status":200,"type":"AccountEmail[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {});
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
         getEmail: async (): Promise<Cloudnode.ApiResponse<Cloudnode.DatedPrimaryEmail>> => {
            return await this.#sendRequest<Cloudnode.DatedPrimaryEmail>({"type":"operation","description":"Get your primary e-mail address","token":"account.details.email","method":"GET","path":"/account/email/primary","parameters":{},"returns":[{"status":200,"type":"DatedPrimaryEmail"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {});
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
         setEmail: async (email: string): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Set your primary e-mail address","token":"account.details.email.update","method":"PUT","path":"/account/email/primary","parameters":{"body":{"email":{"description":"E-mail address to set as primary.","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":409,"type":"Error & {code: \"CONFLICT\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {email});
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
         changePassword: async (currentPassword: string, newPassword: string): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Change account password","token":"account.details.password.update","method":"PUT","path":"/account/password","parameters":{"body":{"currentPassword":{"description":"Your current password.","type":"string","required":true},"newPassword":{"description":"The new password. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {currentPassword, newPassword});
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
         listPermissions: async (): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Permission[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.Permission[]>>({"type":"operation","description":"List account permissions with user-friendly descriptions. Some permissions (such as wildcard ones) may be excluded in this list if they don't have a description.","token":"account.details","method":"GET","path":"/account/permissions","parameters":{},"returns":[{"status":200,"type":"Permission[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {});
         },
    } as const;
    public projects = {
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
         list: async (limit: number = 20, page: number = 1): Promise<Cloudnode.ApiResponse<Cloudnode.PaginatedData<Cloudnode.Project[]>>> => {
            return await this.#sendRequest<Cloudnode.PaginatedData<Cloudnode.Project[]>>({"type":"operation","description":"List projects","token":"projects.get.own","method":"GET","path":"/projects","parameters":{"query":{"limit":{"description":"The number of projects to return per page. No more than 100.","default":"20","type":"number","required":false},"page":{"description":"The page number. No more than 2³² (4294967296).","default":"1","type":"number","required":false}}},"returns":[{"status":200,"type":"Project[]"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {limit: `${limit}`, page: `${page}`}, {});
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
         create: async (name: string): Promise<Cloudnode.ApiResponse<Cloudnode.Project>> => {
            return await this.#sendRequest<Cloudnode.Project>({"type":"operation","description":"Create a project","token":"projects.create.own","method":"POST","path":"/projects","parameters":{"body":{"name":{"description":"Project name. Max 255 characters.","type":"string","required":true}}},"returns":[{"status":201,"type":"Project"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {}, {}, {name});
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
         get: async (id: string): Promise<Cloudnode.ApiResponse<Cloudnode.Project>> => {
            return await this.#sendRequest<Cloudnode.Project>({"type":"operation","description":"Get a project","token":"projects.get.own","method":"GET","path":"/projects/:id","parameters":{"path":{"id":{"description":"Project ID","type":"string","required":true}}},"returns":[{"status":200,"type":"Project"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
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
         update: async (id: string, name: string): Promise<Cloudnode.ApiResponse<Cloudnode.Project>> => {
            return await this.#sendRequest<Cloudnode.Project>({"type":"operation","description":"Update a project","token":"projects.update.own","method":"PATCH","path":"/projects/:id","parameters":{"path":{"id":{"description":"Project ID","type":"string","required":true}},"body":{"name":{"description":"Project name. Max 255 characters.","type":"string","required":true}}},"returns":[{"status":200,"type":"Project"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":422,"type":"Error & {code: \"INVALID_DATA\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {name});
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
         delete: async (id: string): Promise<Cloudnode.ApiResponse<void>> => {
            return await this.#sendRequest<void>({"type":"operation","description":"Delete a project","token":"projects.delete.own","method":"DELETE","path":"/projects/:id","parameters":{"path":{"id":{"description":"Project ID","type":"string","required":true}}},"returns":[{"status":204,"type":"void"},{"status":404,"type":"Error & {code: \"RESOURCE_NOT_FOUND\"}"},{"status":401,"type":"Error & {code: \"UNAUTHORIZED\"}"},{"status":403,"type":"Error & {code: \"NO_PERMISSION\"}"},{"status":429,"type":"Error & {code: \"RATE_LIMITED\"}"},{"status":500,"type":"Error & {code: \"INTERNAL_SERVER_ERROR\"}"},{"status":503,"type":"Error & {code: \"MAINTENANCE\"}"}]}, {id: `${id}`}, {}, {});
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
     * Personal information associated with your account
     */
    export interface AccountIdentity {
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
    export interface PrimaryEmail {
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
    export interface DatedPrimaryEmail {
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
    export interface AccountEmail {
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
    export interface AccountDetails {
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
    export interface Permission {
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
    export interface ShortRequest {
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
    export interface Request {
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
        responseBody: {type: "Buffer", data: number[]} | null;
    }
    /**
     * An isolated group of servers
     */
    export interface Project {
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

        public constructor(response: Response, request: {operation: Schema.Operation, pathParams: Record<string, string>, queryParams: Record<string, string>, body: any}) {
            this.headers = Object.fromEntries([...response.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]));
            this.ok = response.ok;
            this.redirected = response.redirected;
            this.status = response.status;
            this.statusText = response.statusText;
            this.url = new URL(response.url);
            this.request = request;
        }
    }

    export namespace R {
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

    /**
     * API client options
     */
    export interface Options {
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
    export enum CompatibilityStatus {
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
        INCOMPATIBLE = "incompatible",
    }
}

export default Cloudnode;
