export interface Config {
    /**
     * Name of the main class
     */
    name: string;

    /**
     * Preferred instance name
     */
    instanceName: string;

    /**
     * Default API base URL
     */
    baseUrl: string;

    /**
     * Version of the API this client was generated for
     */
    apiVersion: string;

    /**
     * Link to hosted browser version
     */
    browserUrl: string;
}
