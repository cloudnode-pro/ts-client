# Cloudnode API SDK

![Client Version: 1.7.1](https://img.shields.io/badge/Client%20Version-1.7.1-%2316a34a)
![API Version: 5.8.0](https://img.shields.io/badge/API%20Version-5.8.0-%232563eb)
![build: passing](https://img.shields.io/badge/build-passing-%2316a34a)
![npm downloads](https://img.shields.io/npm/dt/cloudnode-ts?label=downloads)

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
<script src="https://cdn.jsdelivr.net/npm/cloudnode-ts@latest/browser/Cloudnode.min.js"></script>
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
   - [`cloudnode.token.create(permissions, lifetime, [note])`](#cloudnodetokencreatepermissions-lifetime-note)
   - [`cloudnode.token.get(id)`](#cloudnodetokengetid)
   - [`cloudnode.token.list([limit], [page], [internal])`](#cloudnodetokenlistlimit-page-internal)
   - [`cloudnode.token.revoke(id)`](#cloudnodetokenrevokeid)
   - [`cloudnode.tokens.refresh()`](#cloudnodetokensrefresh)

 - [Namespace: `Cloudnode`](#namespace-cloudnode)
   - [Class: `Cloudnode.ApiResponse<T>`](#class-cloudnodeapiresponset)
   - [Class: `Cloudnode.RawResponse`](#class-cloudnoderawresponse)
   - [Interface: `Cloudnode.DatedNewsletterSubscription`](#interface-cloudnodedatednewslettersubscription)
   - [Interface: `Cloudnode.Error`](#interface-cloudnodeerror)
   - [Interface: `Cloudnode.Newsletter`](#interface-cloudnodenewsletter)
   - [Interface: `Cloudnode.NewsletterData`](#interface-cloudnodenewsletterdata)
   - [Interface: `Cloudnode.NewsletterSubscription`](#interface-cloudnodenewslettersubscription)
   - [Interface: `Cloudnode.PaginatedData<T>`](#interface-cloudnodepaginateddatat)
   - [Interface: `Cloudnode.PartialToken`](#interface-cloudnodepartialtoken)
   - [Interface: `Cloudnode.Token`](#interface-cloudnodetoken)
   - [Interface: `Cloudnode.TokenMetadata`](#interface-cloudnodetokenmetadata)

</details>

<a name="class-cloudnode"></a>

## Class: `Cloudnode`

A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)

<a name="new-cloudnodetoken-baseurl"></a>

### `new Cloudnode([token], [baseUrl])`

Construct a new Cloudnode API client

 - `token` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> API token to use for requests.
 - `baseUrl` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Base URL of the API. Default: `https://api.cloudnode.pro/v5/`



<a name="cloudnodenewslettergetid"></a>

### `cloudnode.newsletter.get(id)`

Get newsletter

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A newsletter ID.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.Newsletter](#interface-cloudnodenewsletter)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewsletterlistlimit-page"></a>

### `cloudnode.newsletter.list([limit], [page])`

List newsletters

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of newsletters to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)<[Cloudnode.Newsletter[]](#interface-cloudnodenewsletter)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewslettersubscribeid-email-data"></a>

### `cloudnode.newsletter.subscribe(id, email, [data])`

Subscribe to newsletter

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A newsletter ID.
 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Subscriber's email address.
 - `data` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<string, string | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)></code> Additional data that this newsletter requires.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.NewsletterSubscription](#interface-cloudnodenewslettersubscription)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "CONFLICT"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewsletterslistsubscriptionslimit-page"></a>

### `cloudnode.newsletters.listSubscriptions([limit], [page])`

List subscriptions of the authenticated user

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of subscriptions to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)<[Cloudnode.DatedNewsletterSubscription[]](#interface-cloudnodedatednewslettersubscription)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewslettersunsubscribesubscription"></a>

### `cloudnode.newsletters.unsubscribe(subscription)`

Revoke a subscription (unsubscribe)

 - `subscription` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the subscription to revoke.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokencreatepermissions-lifetime-note"></a>

### `cloudnode.token.create(permissions, lifetime, [note])`

Create token

 - `permissions` <code>[string[]](undefined)</code> List of permissions to grant to the token. You must already have each of these permissions with your current token.
 - `lifetime` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).
 - `note` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A user-specified note to label the token. Max length: 2⁸ (256) characters.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.Token](#interface-cloudnodetoken)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokengetid"></a>

### `cloudnode.token.get(id)`

Get token details

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.Token](#interface-cloudnodetoken)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokenlistlimit-page-internal"></a>

### `cloudnode.token.list([limit], [page], [internal])`

List tokens of user

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of tokens to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - `internal` <code>[any](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)</code> Internal tokens are returned as well if this parameter is present.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)<[Cloudnode.PartialToken[]](#interface-cloudnodepartialtoken)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokenrevokeid"></a>

### `cloudnode.token.revoke(id)`

Revoke token

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MODIFICATION_NOT_ALLOWED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokensrefresh"></a>

### `cloudnode.tokens.refresh()`

Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)<[Cloudnode.Token](#interface-cloudnodetoken)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>



<a name="namespace-cloudnode"></a>

## Namespace: `Cloudnode`

A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)

<a name="class-cloudnodeapiresponset"></a>

### Class: `Cloudnode.ApiResponse<T>`

An API response. This class implements the interface provided as `T`.

 - `_response` <code>[Cloudnode.RawResponse](#class-cloudnoderawresponse)</code> Raw API response

<a name="class-cloudnoderawresponse"></a>

### Class: `Cloudnode.RawResponse`

Raw API response

 - `headers` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<string, string></code> The headers returned by the server. (read-only)
 - `ok` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> A boolean indicating whether the response was successful (status in the range `200` – `299`) or not. (read-only)
 - `redirected` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry). (read-only)
 - `status` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The status code of the response. (read-only)
 - `statusText` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The status message corresponding to the status code. (e.g., `OK` for `200`). (read-only)
 - `url` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The URL of the response. (read-only)

<a name="interface-cloudnodedatednewslettersubscription"></a>

### Interface: `Cloudnode.DatedNewsletterSubscription`

A newsletter subscription with a creation date

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the subscription. Can be used to unsubscribe.
 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The email address of the subscriber
 - `newsletter` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the newsletter that was subscribed to
 - `date` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> The date the subscription was created

<a name="interface-cloudnodeerror"></a>

### Interface: `Cloudnode.Error`

An API error response.

 - `message` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A human-readable description of this error
 - `code` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Error code
 - `fields` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<string, string | Record<string, string>></code> Affected request fields. The key is the name of the input parameter (e.g. from the request body or query string) and the value is a human-readable error message for that field.

<a name="interface-cloudnodenewsletter"></a>

### Interface: `Cloudnode.Newsletter`

A newsletter that you can subscribe to

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The unique identifier for this newsletter
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The name of this newsletter
 - `data` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<string, NewsletterData></code> Additional data that is required to subscribe to this newsletter

<a name="interface-cloudnodenewsletterdata"></a>

### Interface: `Cloudnode.NewsletterData`

A data field that is required to subscribe to this newsletter

 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The name of the field
 - `description` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)</code> Description of the field
 - `type` <code>"string" | "number" | "boolean"</code> The type of data
 - `required` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether this field is required

<a name="interface-cloudnodenewslettersubscription"></a>

### Interface: `Cloudnode.NewsletterSubscription`

Your subscription to a newsletter

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the subscription. Can be used to unsubscribe.
 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The email address of the subscriber
 - `newsletter` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the newsletter that was subscribed to

<a name="interface-cloudnodepaginateddatat"></a>

### Interface: `Cloudnode.PaginatedData<T>`

Paginated response

 - `items` <code>[T[]](#interface-cloudnodepaginateddatat)</code> The page items
 - `total` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The total number of items
 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of items per page
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The current page number

<a name="interface-cloudnodepartialtoken"></a>

### Interface: `Cloudnode.PartialToken`

A token, however, the `permissions` field is not included

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID or key of the token
 - `created` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> Date and time when this token was created
 - `expires` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Date and time when this token expires. Null if it never expires.
 - `internal` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)</code> Whether this token is for internal use only, e.g. to power a session. In other words, an internal token is one that was **not** created by the client.
 - `metadata` <code>[Cloudnode.TokenMetadata](#interface-cloudnodetokenmetadata)</code> Additional metadata about this token

<a name="interface-cloudnodetoken"></a>

### Interface: `Cloudnode.Token`

An authentication token

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID or key of the token
 - `created` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> Date and time when this token was created
 - `expires` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Date and time when this token expires. Null if it never expires.
 - `permissions` <code>[string[]](undefined)</code> Permission scopes that this token holds
 - `internal` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)</code> Whether this token is for internal use only, e.g. to power a session. In other words, an internal token is one that was **not** created by the client.
 - `metadata` <code>[Cloudnode.TokenMetadata](#interface-cloudnodetokenmetadata)</code> Additional metadata about this token

<a name="interface-cloudnodetokenmetadata"></a>

### Interface: `Cloudnode.TokenMetadata`

Token metadata

 - `note` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)</code> A user-supplied note for this token




