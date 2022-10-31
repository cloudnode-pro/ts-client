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
     * @param [baseUrl="https://api.cloudnode.pro/v5"] Base URL of the API
     */
    constructor(token, baseUrl = "https://api.cloudnode.pro/v5") {
        this.token = token;
        this.baseUrl = baseUrl;
    }
}
export default Cloudnode;
