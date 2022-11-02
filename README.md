# Cloudnode API SDK

![Client Version: 1.3.2](https://img.shields.io/badge/Client%20Version-1.3.2-%2316a34a)
![API Version: 5.6.2](https://img.shields.io/badge/API%20Version-5.6.2-%232563eb)

A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https:&#x2F;&#x2F;github.com&#x2F;cloudnode-pro&#x2F;ts-client#documentation)

## Install
```shell
npm install cloudnode-ts
```

## Usage
### JavaScript
#### Node.js (ES6)
```js
import Cloudnode from 'cloudnode-ts';

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
```

#### Node.js (CommonJS)
```js
const Cloudnode = require('cloudnode-ts');

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
```

#### Browser
Download the browser SDK from `browser/Cloudnode.js` or use our hosted version.
```html
<script src="https://cloudnode.pro/assets/js/sdk.min.js"></script>
<script>
const cloudnode = new Cloudnode();

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
</script>
```
> **Warning**: You most likely don't want to set your private token in a public front-end website, as this will allow anyone who sees your front-end JavaScript code to use it for possibly malicious purposes. We advise you use a back-end server to proxy requests to our API, so you do not expose your token to the public.

### TypeScript
```ts
import Cloudnode from 'cloudnode-ts';

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter: Cloudnode.Newsletter = await cloudnode.newsletter.get("newsletter_123asd");
```

# Documentation

<details open>  <summary>Table of contents</summary>

 - [Class: `Cloudnode`](#class-cloudnode)
   - [`new Cloudnode([token], [baseUrl])`](#new-cloudnodetoken-baseurl)
   - [`cloudnode.newsletter.get(id)`](#cloudnodenewslettergetid)
   - [`cloudnode.newsletter.list([limit], [page])`](#cloudnodenewsletterlistlimit-page)
   - [`cloudnode.newsletter.subscribe(id, email, [data])`](#cloudnodenewslettersubscribeid-email-data)
   - [`cloudnode.newsletters.listSubscriptions([limit], [page])`](#cloudnodenewsletterslistsubscriptionslimit-page)
   - [`cloudnode.newsletters.unsubscribe(subscription)`](#cloudnodenewslettersunsubscribesubscription)

 - [Namespace: `Cloudnode`](#namespace-cloudnode)
   - [Interface: `Cloudnode.DatedNewsletterSubscription`](#interface-cloudnodedatednewslettersubscription)
   - [Interface: `Cloudnode.Error`](#interface-cloudnodeerror)
   - [Interface: `Cloudnode.Newsletter`](#interface-cloudnodenewsletter)
   - [Interface: `Cloudnode.NewsletterData`](#interface-cloudnodenewsletterdata)
   - [Interface: `Cloudnode.NewsletterSubscription`](#interface-cloudnodenewslettersubscription)

</details>

<a name="class-cloudnode"></a>

## Class: `Cloudnode`

A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)

<a name="new-cloudnodetoken-baseurl"></a>

### `new Cloudnode([token], [baseUrl])`

Construct a new Cloudnode API client

 - `token` `string` API token to use for requests.
 - `baseUrl` `string` Base URL of the API. Default: `https://api.cloudnode.pro/v5/`



<a name="cloudnodenewslettergetid"></a>

### `cloudnode.newsletter.get(id)`

Get newsletter

 - `id` `string` A newsletter ID.
 - Returns: `Cloudnode.Newsletter`
 - Throws: `Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`

<a name="cloudnodenewsletterlistlimit-page"></a>

### `cloudnode.newsletter.list([limit], [page])`

List newsletters

 - `limit` `number` The number of newsletters to return per page. No more than 50. Default: `10`
 - `page` `number` The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: `Cloudnode.PaginatedData<Cloudnode.Newsletter[]>`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`

<a name="cloudnodenewslettersubscribeid-email-data"></a>

### `cloudnode.newsletter.subscribe(id, email, [data])`

Subscribe to newsletter

 - `id` `string` A newsletter ID.
 - `email` `string` Subscriber's email address.
 - `data` `Record<string, string | number | boolean>` Additional data that this newsletter requires.
 - Returns: `Cloudnode.NewsletterSubscription`
 - Throws: `Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}`
 - Throws: `Cloudnode.Error & {code: "INVALID_DATA"}`
 - Throws: `Cloudnode.Error & {code: "CONFLICT"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`

<a name="cloudnodenewsletterslistsubscriptionslimit-page"></a>

### `cloudnode.newsletters.listSubscriptions([limit], [page])`

List subscriptions of the authenticated user

 - `limit` `number` The number of subscriptions to return per page. No more than 50. Default: `10`
 - `page` `number` The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: `Cloudnode.PaginatedData<Cloudnode.DatedNewsletterSubscription[]>`
 - Throws: `Cloudnode.Error & {code: "UNAUTHORIZED"}`
 - Throws: `Cloudnode.Error & {code: "NO_PERMISSION"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`

<a name="cloudnodenewslettersunsubscribesubscription"></a>

### `cloudnode.newsletters.unsubscribe(subscription)`

Revoke a subscription (unsubscribe)

 - `subscription` `string` The ID of the subscription to revoke.
 - Returns: `void`
 - Throws: `Cloudnode.Error & {code: "RESOURCE_NOT_FOUND"}`
 - Throws: `Cloudnode.Error & {code: "INVALID_DATA"}`
 - Throws: `Cloudnode.Error & {code: "INTERNAL_SERVER_ERROR"}`
 - Throws: `Cloudnode.Error & {code: "RATE_LIMITED"}`



<a name="namespace-cloudnode"></a>

## Namespace: `Cloudnode`

A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)

<a name="interface-cloudnodedatednewslettersubscription"></a>

### Interface: `Cloudnode.DatedNewsletterSubscription`

A newsletter subscription with a creation date

 - `id` `string` The ID of the subscription. Can be used to unsubscribe.
 - `email` `string` The email address of the subscriber
 - `newsletter` `string` The ID of the newsletter that was subscribed to
 - `date` `Date` The date the subscription was created

<a name="interface-cloudnodeerror"></a>

### Interface: `Cloudnode.Error`

An API error response.

 - `message` `string` A human-readable description of this error
 - `code` `string` Error code
 - `fields` `Record<string, string | Record<string, string>>` Affected request fields. The key is the name of the input parameter (e.g. from the request body or query string) and the value is a human-readable error message for that field.

<a name="interface-cloudnodenewsletter"></a>

### Interface: `Cloudnode.Newsletter`

A newsletter that you can subscribe to

 - `id` `string` The unique identifier for this newsletter
 - `name` `string` The name of this newsletter
 - `data` `Record<string, NewsletterData>` Additional data that is required to subscribe to this newsletter

<a name="interface-cloudnodenewsletterdata"></a>

### Interface: `Cloudnode.NewsletterData`

A data field that is required to subscribe to this newsletter

 - `name` `string` The name of the field
 - `description` `string | undefined` Description of the field
 - `type` `"string" | "number" | "boolean"` The type of data
 - `required` `boolean` Whether this field is required

<a name="interface-cloudnodenewslettersubscription"></a>

### Interface: `Cloudnode.NewsletterSubscription`

Your subscription to a newsletter

 - `id` `string` The ID of the subscription. Can be used to unsubscribe.
 - `email` `string` The email address of the subscriber
 - `newsletter` `string` The ID of the newsletter that was subscribed to




