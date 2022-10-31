class Cloudnode {
	/**
	 * API token to use for requests
	 * @readonly
	 */
	public readonly token?: string;

	/**
	 * Base URL of the API
	 * @readonly
	 */
  public readonly baseUrl: string;

	/**
	 * Construct a new Cloudnode API client
	 * @param token API token to use for requests
	 * @param [baseUrl="https://api.cloudnode.pro/v5"] Base URL of the API
	 */
	public constructor(token?: string, baseUrl = "https://api.cloudnode.pro/v5") {
		this.token = token;
		this.baseUrl = baseUrl;
	}
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
}

export default Cloudnode;
