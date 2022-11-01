# Cloudnode API SDK



Cloudnode v5 API TypeScript client

## Install
```shell
npm install ts-client
```

## Usage
### JavaScript
#### Node.js (ES6)
```js
import Cloudnode from 'ts-client';

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
```

#### Node.js (CommonJS)
```js
const Cloudnode = require('ts-client');

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
```

#### Browser
Coming soon!

### TypeScript
```ts
import Cloudnode from 'ts-client';

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter: Cloudnode.Newsletter = await cloudnode.newsletter.get("newsletter_123asd");
```

# Documentation

<details open>  <summary>Table of contents</summary>

 - [Class: `Cloudnode`](#class-cloudnode)
   - [`new Cloudnode([token], [baseUrl])`](#new-cloudnodetoken-baseurl)
   - [`newsletter.get(id)`](#newslettergetid)
   - [`newsletter.list([limit], [page])`](#newsletterlistlimit-page)
   - [`newsletter.subscribe(id, email, [data])`](#newslettersubscribeid-email-data)
   - [`newsletters.listSubscriptions([limit], [page])`](#newsletterslistsubscriptionslimit-page)
   - [`newsletters.unsubscribe(subscription)`](#newslettersunsubscribesubscription)

 - [Namespace: `Cloudnode`](#namespace-cloudnode)
   - [Interface: `Cloudnode.DatedNewsletterSubscription`](#interface-cloudnodedatednewslettersubscription)
   - [Interface: `Cloudnode.Error`](#interface-cloudnodeerror)
   - [Interface: `Cloudnode.Newsletter`](#interface-cloudnodenewsletter)
   - [Interface: `Cloudnode.NewsletterData`](#interface-cloudnodenewsletterdata)
   - [Interface: `Cloudnode.NewsletterSubscription`](#interface-cloudnodenewslettersubscription)

</details>

<a name="class-cloudnode"></a>

## Class: `Cloudnode`

Cloudnode v5 API TypeScript client

<a name="new-cloudnodetoken-baseurl"></a>

### `new Cloudnode([token], [baseUrl])`

Construct a new Cloudnode API client

 - `token` `string` API token to use for requests.
 - `baseUrl` `string` Base URL of the API.Default: `https://api.cloudnode.pro/v5/`

<a name="newslettergetid"></a>

### `newsletter.get(id)`

Get newsletter

 - `id` `string` A newsletter ID.
 - Returns: `Cloudnode.Newsletter`
 - Throws: `Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`<a name="newsletterlistlimit-page"></a>

### `newsletter.list([limit], [page])`

List newsletters

 - `limit` `number` The number of newsletters to return per page. No more than 50..Default: `10`
 - `page` `number` The page number. No more than 2³² (4294967296)..Default: `1`
 - Returns: `Cloudnode.PaginatedData<Cloudnode.Newsletter[]>`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`<a name="newslettersubscribeid-email-data"></a>

### `newsletter.subscribe(id, email, [data])`

Subscribe to newsletter

 - `id` `string` A newsletter ID.
 - `email` `string` Subscriber's email address.
 - `data` `Record<string, string | number | boolean>` Additional data that this newsletter requires.
 - Returns: `Cloudnode.NewsletterSubscription`
 - Throws: `Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}`
 - Throws: `Cloudnode.Error & {code: "INVALID_DATA"}`
 - Throws: `Cloudnode.Error & {code: "CONFLICT"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`<a name="newsletterslistsubscriptionslimit-page"></a>

### `newsletters.listSubscriptions([limit], [page])`

List subscriptions of the authenticated user

 - `limit` `number` The number of subscriptions to return per page. No more than 50..Default: `10`
 - `page` `number` The page number. No more than 2³² (4294967296)..Default: `1`
 - Returns: `Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>`
 - Throws: `Cloudnode.Error & {code: "UNAUTHORIZED"}`
 - Throws: `Cloudnode.Error & {code: "NO_PERMISSION"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`<a name="newslettersunsubscribesubscription"></a>

### `newsletters.unsubscribe(subscription)`

Revoke a subscription (unsubscribe)

 - `subscription` `string` The ID of the subscription to revoke.
 - Returns: `void`
 - Throws: `Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}`
 - Throws: `Cloudnode.Error & {code: "INVALID_DATA"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`

<a name="namespace-cloudnode"></a>

## Namespace: `Cloudnode`

Cloudnode v5 API TypeScript client

<a name="interface-cloudnodedatednewslettersubscription"></a>

### Interface: `Cloudnode.DatedNewsletterSubscription`

A newsletter subscription with a creation date

 - `id` `string` The ID of the subscription. Can be used to unsubscribe.
 - `email` `string` The email address of the subscriber
 - `newsletter` `string` The ID of the newsletter that was subscribed to
 - `date` `Date` The date the subscription was created<a name="interface-cloudnodeerror"></a>

### Interface: `Cloudnode.Error`

An API error response.

 - `message` `string` A human-readable description of this error
 - `code` `string` Error code
 - `fields` `Record<string, string | Record<string, string>>` Affected request fields. The key is the name of the input parameter (e.g. from the request body or query string) and the value is a human-readable error message for that field.<a name="interface-cloudnodenewsletter"></a>

### Interface: `Cloudnode.Newsletter`

A newsletter that you can subscribe to

 - `id` `string` The unique identifier for this newsletter
 - `name` `string` The name of this newsletter
 - `data` `Record<string, NewsletterData>` Additional data that is required to subscribe to this newsletter<a name="interface-cloudnodenewsletterdata"></a>

### Interface: `Cloudnode.NewsletterData`

A data field that is required to subscribe to this newsletter

 - `name` `string` The name of the field
 - `description` `string | undefined` Description of the field
 - `type` `"string" | "number" | "boolean"` The type of data
 - `required` `boolean` Whether this field is required<a name="interface-cloudnodenewslettersubscription"></a>

### Interface: `Cloudnode.NewsletterSubscription`

Your subscription to a newsletter

 - `id` `string` The ID of the subscription. Can be used to unsubscribe.
 - `email` `string` The email address of the subscriber
 - `newsletter` `string` The ID of the newsletter that was subscribed to


