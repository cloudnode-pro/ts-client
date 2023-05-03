# Cloudnode API SDK

![Client Version: 1.10.3](https://img.shields.io/badge/Client%20Version-1.10.3-%2316a34a)
![API Version: 5.11.4](https://img.shields.io/badge/API%20Version-5.11.4-%232563eb)
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
// get response status code
console.log(newsletter._response.status); // 200
```

#### Node.js (CommonJS)
```js
const Cloudnode = require('cloudnode-ts');

const cloudnode = new Cloudnode("token_YourSecretToken123");

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
console.log(newsletter._response.status); // 200
```

#### Browser
Download the browser SDK from `browser/Cloudnode.js` or use our hosted version.
```html
<script src="https://cdn.jsdelivr.net/npm/cloudnode-ts@latest/browser/Cloudnode.min.js"></script>
<script>
const cloudnode = new Cloudnode();

// get a newsletter
const newsletter = await cloudnode.newsletter.get("newsletter_123asd");
console.log(newsletter._response.status); // 200
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
If you want to access response metadata (headers, status code, etc.), use `Cloudnode.ApiResponse<T>`, e.g.:
```ts
const newsletter: Cloudnode.ApiResponse<Cloudnode.Newsletter> = await cloudnode.newsletter.get("newsletter_123asd");
console.log(newsletter.id); // newsletter_123asd
console.log(newsletter._response.status); // 200
```

# Documentation

<details open>  <summary>Table of contents</summary>

 - [Class: `Cloudnode`](#class-cloudnode)
   - [`new Cloudnode([token], [options])`](#new-cloudnodetoken-options)
   - [`cloudnode.getPage<T>(response, page)`](#cloudnodegetpagetresponse-page)
   - [`cloudnode.getNextPage<T>(response)`](#cloudnodegetnextpagetresponse)
   - [`cloudnode.getPreviousPage<T>(response)`](#cloudnodegetpreviouspagetresponse)
   - [`cloudnode.getAllPages<T>(response)`](#cloudnodegetallpagestresponse)
   - [`cloudnode.checkCompatibility()`](#cloudnodecheckcompatibility)
   - [`cloudnode.account.changePassword(currentPassword, newPassword)`](#cloudnodeaccountchangepasswordcurrentpassword-newpassword)
   - [`cloudnode.account.get()`](#cloudnodeaccountget)
   - [`cloudnode.account.getEmail()`](#cloudnodeaccountgetemail)
   - [`cloudnode.account.getIdentity()`](#cloudnodeaccountgetidentity)
   - [`cloudnode.account.listEmails()`](#cloudnodeaccountlistemails)
   - [`cloudnode.account.listPermissions()`](#cloudnodeaccountlistpermissions)
   - [`cloudnode.account.replaceIdentity(username, name)`](#cloudnodeaccountreplaceidentityusername-name)
   - [`cloudnode.account.setEmail(email)`](#cloudnodeaccountsetemailemail)
   - [`cloudnode.account.updateIdentity(username, [name])`](#cloudnodeaccountupdateidentityusername-name)
   - [`cloudnode.auth.login(user, password)`](#cloudnodeauthloginuser-password)
   - [`cloudnode.auth.register(username, email, password)`](#cloudnodeauthregisterusername-email-password)
   - [`cloudnode.newsletter.get(id)`](#cloudnodenewslettergetid)
   - [`cloudnode.newsletter.list([limit], [page])`](#cloudnodenewsletterlistlimit-page)
   - [`cloudnode.newsletter.subscribe(id, email, [data])`](#cloudnodenewslettersubscribeid-email-data)
   - [`cloudnode.newsletters.listSubscriptions([limit], [page])`](#cloudnodenewsletterslistsubscriptionslimit-page)
   - [`cloudnode.newsletters.unsubscribe(subscription)`](#cloudnodenewslettersunsubscribesubscription)
   - [`cloudnode.projects.create(name)`](#cloudnodeprojectscreatename)
   - [`cloudnode.projects.delete(id)`](#cloudnodeprojectsdeleteid)
   - [`cloudnode.projects.get(id)`](#cloudnodeprojectsgetid)
   - [`cloudnode.projects.list([limit], [page])`](#cloudnodeprojectslistlimit-page)
   - [`cloudnode.projects.update(id, name)`](#cloudnodeprojectsupdateid-name)
   - [`cloudnode.token.create(permissions, lifetime, [note])`](#cloudnodetokencreatepermissions-lifetime-note)
   - [`cloudnode.token.get(id)`](#cloudnodetokengetid)
   - [`cloudnode.token.getRequest(id, request)`](#cloudnodetokengetrequestid-request)
   - [`cloudnode.token.list([limit], [page], [internal])`](#cloudnodetokenlistlimit-page-internal)
   - [`cloudnode.token.listRequests(id, [limit], [page])`](#cloudnodetokenlistrequestsid-limit-page)
   - [`cloudnode.token.revoke(id)`](#cloudnodetokenrevokeid)
   - [`cloudnode.tokens.refresh()`](#cloudnodetokensrefresh)

 - [Namespace: `Cloudnode`](#namespace-cloudnode)
   - [Class: `Cloudnode.ApiResponse<T>`](#class-cloudnodeapiresponset)
   - [Class: `Cloudnode.RawResponse`](#class-cloudnoderawresponse)
   - [Interface: `Cloudnode.AccountDetails`](#interface-cloudnodeaccountdetails)
   - [Interface: `Cloudnode.AccountEmail`](#interface-cloudnodeaccountemail)
   - [Interface: `Cloudnode.AccountIdentity`](#interface-cloudnodeaccountidentity)
   - [Interface: `Cloudnode.DatedNewsletterSubscription`](#interface-cloudnodedatednewslettersubscription)
   - [Interface: `Cloudnode.DatedPrimaryEmail`](#interface-cloudnodedatedprimaryemail)
   - [Interface: `Cloudnode.Error`](#interface-cloudnodeerror)
   - [Interface: `Cloudnode.Newsletter`](#interface-cloudnodenewsletter)
   - [Interface: `Cloudnode.NewsletterData`](#interface-cloudnodenewsletterdata)
   - [Interface: `Cloudnode.NewsletterSubscription`](#interface-cloudnodenewslettersubscription)
   - [Interface: `Cloudnode.Options`](#interface-cloudnodeoptions)
   - [Interface: `Cloudnode.PaginatedData<T>`](#interface-cloudnodepaginateddatat)
   - [Interface: `Cloudnode.PartialToken`](#interface-cloudnodepartialtoken)
   - [Interface: `Cloudnode.Permission`](#interface-cloudnodepermission)
   - [Interface: `Cloudnode.PrimaryEmail`](#interface-cloudnodeprimaryemail)
   - [Interface: `Cloudnode.Project`](#interface-cloudnodeproject)
   - [Interface: `Cloudnode.Request`](#interface-cloudnoderequest)
   - [Interface: `Cloudnode.ShortRequest`](#interface-cloudnodeshortrequest)
   - [Interface: `Cloudnode.Token`](#interface-cloudnodetoken)
   - [Interface: `Cloudnode.TokenMetadata`](#interface-cloudnodetokenmetadata)

</details>

<a name="class-cloudnode"></a>

## Class: `Cloudnode`

A client SDK for the Cloudnode API, written in TypeScript. [Documentation](https://github.com/cloudnode-pro/ts-client#documentation)

<a name="new-cloudnodetoken-options"></a>

### `new Cloudnode([token], [options])`

Construct a new Cloudnode API client

 - `token` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> API token to use for requests.
 - `options` <code>[Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)&lt;[Cloudnode.Options](#interface-cloudnodeoptions)></code> API client options. Default: `{baseUrl: "https://api.cloudnode.pro/v5/", autoRetry: true, maxRetryDelay: 5, maxRetries: 3}`



<a name="cloudnodegetpagetresponse-page"></a>

### `cloudnode.getPage<T>(response, page)`

Get another page of paginated results

 - `response` <code>[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>></code> Response to get a different page of.
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> Page to get.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>> | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)></code> The new page or null if the page is out of bounds
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror)</code> Error returned by the API

<a name="cloudnodegetnextpagetresponse"></a>

### `cloudnode.getNextPage<T>(response)`

Get next page of paginated results

 - `response` <code>[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>></code> Response to get the next page of.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>> | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)></code> The next page or null if this is the last page
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror)</code> Error returned by the API

<a name="cloudnodegetpreviouspagetresponse"></a>

### `cloudnode.getPreviousPage<T>(response)`

Get previous page of paginated results

 - `response` <code>[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>></code> Response to get the previous page of.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>> | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)></code> The previous page or null if this is the first page
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror)</code> Error returned by the API

<a name="cloudnodegetallpagestresponse"></a>

### `cloudnode.getAllPages<T>(response)`

Get all other pages of paginated results and return the complete data
> **Warning:** Depending on the amount of data, this can take a long time and use a lot of memory.

 - `response` <code>[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>></code> Response to get all pages of.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;T>></code> All of the data in 1 page
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror)</code> Error returned by the API

<a name="cloudnodecheckcompatibility"></a>

### `cloudnode.checkCompatibility()`

Check compatibility with the API


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;"compatible" | "outdated" | "incompatible"></code> `compatible` - versions are fully compatible (only patch version may differ), `outdated` - compatible, but new features unavailable (minor version differs), `incompatible` - breaking changes (major version differs)


<a name="cloudnodeaccountchangepasswordcurrentpassword-newpassword"></a>

### `cloudnode.account.changePassword(currentPassword, newPassword)`

Change account password. Requires token with scope `account.details.password.update`.

 - `currentPassword` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Your current password.
 - `newPassword` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The new password. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountget"></a>

### `cloudnode.account.get()`

Get account details. Requires token with scope `account.details`.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.AccountDetails](#interface-cloudnodeaccountdetails)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountgetemail"></a>

### `cloudnode.account.getEmail()`

Get your primary e-mail address. Requires token with scope `account.details.email`.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.DatedPrimaryEmail](#interface-cloudnodedatedprimaryemail)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountgetidentity"></a>

### `cloudnode.account.getIdentity()`

Get account identity. Requires token with scope `account.details.identity`.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.AccountIdentity](#interface-cloudnodeaccountidentity)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountlistemails"></a>

### `cloudnode.account.listEmails()`

List account e-mail addresses. Requires token with scope `account.details.email.list`.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.AccountEmail[]](#interface-cloudnodeaccountemail)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountlistpermissions"></a>

### `cloudnode.account.listPermissions()`

List account permissions with user-friendly descriptions. Some permissions (such as wildcard ones) may be excluded in this list if they don't have a description. Requires token with scope `account.details`.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.Permission[]](#interface-cloudnodepermission)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountreplaceidentityusername-name"></a>

### `cloudnode.account.replaceIdentity(username, name)`

Replace account identity. Requires token with scope `account.details.identity.update`.

 - `username` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Your unique username. Between 3 and 64 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your full name. Set to `null` to remove.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.AccountIdentity](#interface-cloudnodeaccountidentity)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "CONFLICT"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountsetemailemail"></a>

### `cloudnode.account.setEmail(email)`

Set your primary e-mail address. Requires token with scope `account.details.email.update`.

 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> E-mail address to set as primary.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "CONFLICT"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeaccountupdateidentityusername-name"></a>

### `cloudnode.account.updateIdentity(username, [name])`

Update account identity. Requires token with scope `account.details.identity.update`.

 - `username` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Your unique username. Between 3 and 64 characters. Only letters, numbers, dashes and underscores. May not start with `user_`.
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your full name. Set to `null` to remove.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.AccountIdentity](#interface-cloudnodeaccountidentity)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "CONFLICT"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeauthloginuser-password"></a>

### `cloudnode.auth.login(user, password)`

Create a session using user ID/username/e-mail and password.

> **Note**: Logging in can only be performed from residential IP. Proxying this endpoint will likely not work. It is normally not recommended to use this endpoint to gain API access. Instead, create a token from your account to use with the API.

 - `user` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> User ID (starts with `user_`), username or e-mail address.
 - `password` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The password of the account.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;{session: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)}>></code> Session token. Also returned in `Set-Cookie` header.
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "IP_REJECTED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeauthregisterusername-email-password"></a>

### `cloudnode.auth.register(username, email, password)`

Create an account and session. After signing up, a welcome e-mail is sent to confirm your e-mail address.

> **Note**: Registering an account can only be performed from residential IP. Proxying this endpoint will likely not work. Creating multiple/alternate accounts is not allowed as per the Terms of Service.

 - `username` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The username to use for the account. Must be between 3 and 32 characters long. Cannot start with `user_`. May contain only letters, numbers, dashes and underscores. Must be unique.
 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The e-mail address to register. A valid unique non-disposable e-mail that can receive mail is required.
 - `password` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The password to use for the account. Must be at least 15 characters, or 8 characters if it contains a mix of letters, numbers and symbols.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;{session: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)}>></code> Session token. Also returned in `Set-Cookie` header.
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "IP_REJECTED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewslettergetid"></a>

### `cloudnode.newsletter.get(id)`

Get newsletter

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A newsletter ID.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Newsletter](#interface-cloudnodenewsletter)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewsletterlistlimit-page"></a>

### `cloudnode.newsletter.list([limit], [page])`

List newsletters

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of newsletters to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.Newsletter[]](#interface-cloudnodenewsletter)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewslettersubscribeid-email-data"></a>

### `cloudnode.newsletter.subscribe(id, email, [data])`

Subscribe to newsletter

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A newsletter ID.
 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Subscriber's email address.
 - `data` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)></code> Additional data that this newsletter requires.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.NewsletterSubscription](#interface-cloudnodenewslettersubscription)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "CONFLICT"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewsletterslistsubscriptionslimit-page"></a>

### `cloudnode.newsletters.listSubscriptions([limit], [page])`

List subscriptions of the authenticated user. Requires token with scope `newsletter.subscriptions.list.own`.

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of subscriptions to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.DatedNewsletterSubscription[]](#interface-cloudnodedatednewslettersubscription)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodenewslettersunsubscribesubscription"></a>

### `cloudnode.newsletters.unsubscribe(subscription)`

Revoke a subscription (unsubscribe)

 - `subscription` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the subscription to revoke.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeprojectscreatename"></a>

### `cloudnode.projects.create(name)`

Create a project. Requires token with scope `projects.create.own`.

 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Project name. Max 255 characters.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Project](#interface-cloudnodeproject)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeprojectsdeleteid"></a>

### `cloudnode.projects.delete(id)`

Delete a project. Requires token with scope `projects.delete.own`.

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Project ID.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeprojectsgetid"></a>

### `cloudnode.projects.get(id)`

Get a project. Requires token with scope `projects.get.own`.

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Project ID.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Project](#interface-cloudnodeproject)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeprojectslistlimit-page"></a>

### `cloudnode.projects.list([limit], [page])`

List projects. Requires token with scope `projects.get.own`.

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of projects to return per page. No more than 100. Default: `20`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.Project[]](#interface-cloudnodeproject)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodeprojectsupdateid-name"></a>

### `cloudnode.projects.update(id, name)`

Update a project. Requires token with scope `projects.update.own`.

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Project ID.
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Project name. Max 255 characters.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Project](#interface-cloudnodeproject)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokencreatepermissions-lifetime-note"></a>

### `cloudnode.token.create(permissions, lifetime, [note])`

Create token. Requires token with scope `tokens.create.own`.

 - `permissions` <code>[string[]](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> List of permissions to grant to the token. You must already have each of these permissions with your current token.
 - `lifetime` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> Lifetime of the token in seconds. If null, the token will never expire (not recommended). Max: 31560000 (1 year). Min: 60 (1 minute).
 - `note` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A user-specified note to label the token. Max length: 2⁸ (256) characters.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Token](#interface-cloudnodetoken)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokengetid"></a>

### `cloudnode.token.get(id)`

Get token details. Requires token with scope `tokens.get.own`.

 - `id` <code>string | "current"</code> The ID of the token to get. Specify `current` to get information about the token that was used to authenticate the request.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Token](#interface-cloudnodetoken)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokengetrequestid-request"></a>

### `cloudnode.token.getRequest(id, request)`

Get a recent request by ID. Requires token with scope `tokens.get.own.requests`.

 - `id` <code>string | "current"</code> The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.
 - `request` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the request.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Request](#interface-cloudnoderequest)>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokenlistlimit-page-internal"></a>

### `cloudnode.token.list([limit], [page], [internal])`

List tokens of user. Requires token with scope `tokens.list.own`.

 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of tokens to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - `internal` <code>[any](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)</code> Internal tokens are returned as well if this parameter is present.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.PartialToken[]](#interface-cloudnodepartialtoken)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokenlistrequestsid-limit-page"></a>

### `cloudnode.token.listRequests(id, [limit], [page])`

Get list of recent requests made with the token. Requires token with scope `tokens.get.own.requests`.

 - `id` <code>string | "current"</code> The ID of the token. Specify `current` to get information about the token that was used to authenticate the request.
 - `limit` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The number of requests to return per page. No more than 50. Default: `10`
 - `page` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The page number. No more than 2³² (4294967296). Default: `1`
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.PaginatedData](#interface-cloudnodepaginateddatat)&lt;[Cloudnode.ShortRequest[]](#interface-cloudnodeshortrequest)>>></code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RESOURCE_NOT_FOUND"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INVALID_DATA"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "UNAUTHORIZED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "NO_PERMISSION"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "RATE_LIMITED"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "INTERNAL_SERVER_ERROR"}</code>
 - Throws: <code>[Cloudnode.Error](#interface-cloudnodeerror) & {code: "MAINTENANCE"}</code>

<a name="cloudnodetokenrevokeid"></a>

### `cloudnode.token.revoke(id)`

Revoke token. Requires token with scope `tokens.revoke.own`.

 - `id` <code>string | "current"</code> The ID of the token to revoke. Specify `current` to revoke the token that was used to authenticate the request.
 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[void](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>></code>
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

Refresh current token. The token that was used to authenticate the request will be deleted. A new token with a new ID but the same permissions will be created and returned. The lifespan of the new token will be the same as the old one, starting from the time of the request. This operation effectively allows a token to be used indefinitely. Requires token with scope `token.refresh`.


 - Returns: <code>[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Cloudnode.ApiResponse](#class-cloudnodeapiresponset)&lt;[Cloudnode.Token](#interface-cloudnodetoken)>></code>
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

An API response. This class implements the interface provided as `T` and includes all of its properties.

 - `_response` <code>[Cloudnode.RawResponse](#class-cloudnoderawresponse)</code> Raw API response

<a name="class-cloudnoderawresponse"></a>

### Class: `Cloudnode.RawResponse`

Raw API response

 - `headers` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)></code> The headers returned by the server. (read-only)
 - `ok` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> A boolean indicating whether the response was successful (status in the range `200` – `299`) or not. (read-only)
 - `redirected` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry). (read-only)
 - `status` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The status code of the response. (read-only)
 - `statusText` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The status message corresponding to the status code. (e.g., `OK` for `200`). (read-only)
 - `url` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The URL of the response. (read-only)

<a name="interface-cloudnodeaccountdetails"></a>

### Interface: `Cloudnode.AccountDetails`

Details about your account

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Your user ID
 - `password` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether you have a password set
 - `group` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The name of your permission group
 - `permissions` <code>[string[]](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A list of all permission that you have access to
 - `identity` <code>[AccountIdentity](#interface-cloudnodeaccountidentity) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Personal information associated with your account. Requires `account.details.identity` to see. Maybe be null if the account is anonymised or you don't have permission to access the account identity.
 - `email` <code>[PrimaryEmail](#interface-cloudnodeprimaryemail) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your current primary account e-mail address. Requires `account.details.email` to see. Maybe be null if you don't have a primary e-mail address or you don't have permission to access the account's e-mail address.

<a name="interface-cloudnodeaccountemail"></a>

### Interface: `Cloudnode.AccountEmail`

An e-mail address you have added to your account

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the e-mail address
 - `address` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your e-mail address. May ben null if anonymised.
 - `verified` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether this e-mail address has been verified
 - `primary` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether this e-mail address is your primary e-mail address
 - `added` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> The date and time when this e-mail address was added to your account

<a name="interface-cloudnodeaccountidentity"></a>

### Interface: `Cloudnode.AccountIdentity`

Personal information associated with your account

 - `username` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Your unique username
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your name

<a name="interface-cloudnodedatednewslettersubscription"></a>

### Interface: `Cloudnode.DatedNewsletterSubscription`

A newsletter subscription with a creation date

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the subscription. Can be used to unsubscribe.
 - `email` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The email address of the subscriber
 - `newsletter` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the newsletter that was subscribed to
 - `date` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> The date the subscription was created

<a name="interface-cloudnodedatedprimaryemail"></a>

### Interface: `Cloudnode.DatedPrimaryEmail`

Your current primary account e-mail address with a timestamp of when it was added to your account

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the e-mail address
 - `address` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your e-mail address. May ben null if anonymised.
 - `verified` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether this e-mail address has been verified
 - `added` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> The date and time when this e-mail address was added to your account

<a name="interface-cloudnodeerror"></a>

### Interface: `Cloudnode.Error`

An API error response.

 - `message` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> A human-readable description of this error
 - `code` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Error code
 - `fields` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>></code> Affected request fields. The key is the name of the input parameter (e.g. from the request body or query string) and the value is a human-readable error message for that field.

<a name="interface-cloudnodenewsletter"></a>

### Interface: `Cloudnode.Newsletter`

A newsletter that you can subscribe to

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The unique identifier for this newsletter
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The name of this newsletter
 - `data` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [NewsletterData](#interface-cloudnodenewsletterdata)></code> Additional data that is required to subscribe to this newsletter

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

<a name="interface-cloudnodeoptions"></a>

### Interface: `Cloudnode.Options`

API client options

 - `baseUrl` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The base URL of the API
 - `autoRetry` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether to automatically retry requests that fail temporarily.
If enabled, when a request fails due to a temporary error, such as a rate limit, the request will be retried after the specified delay.
 - `maxRetryDelay` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The maximum number of seconds that is acceptable to wait before retrying a failed request.
This requires `autoRetry` to be enabled.
 - `maxRetries` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The maximum number of times to retry a failed request.
This requires `autoRetry` to be enabled.

<a name="interface-cloudnodepaginateddatat"></a>

### Interface: `Cloudnode.PaginatedData<T>`

Paginated response

 - `items` <code>T[]</code> The page items
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

<a name="interface-cloudnodepermission"></a>

### Interface: `Cloudnode.Permission`

A permission node

 - `permission` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The permission node string
 - `description` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> User-friendly description of the permission node
 - `note` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Additional user-friendly information about the permission node
 - `group` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> A group/category title that can be used to group permissions together

<a name="interface-cloudnodeprimaryemail"></a>

### Interface: `Cloudnode.PrimaryEmail`

Your current primary account e-mail address

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the e-mail address
 - `address` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Your primary e-mail address. May ben null if anonymised.
 - `verified` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether this e-mail address has been verified

<a name="interface-cloudnodeproject"></a>

### Interface: `Cloudnode.Project`

An isolated group of servers

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the project
 - `name` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Project name
 - `user` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> ID of the user that owns this project

<a name="interface-cloudnoderequest"></a>

### Interface: `Cloudnode.Request`

A request

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the request
 - `method` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The request method (e.g. GET, POST, HEAD, etc.
 - `scheme` <code>"http" | "https"</code> The URL scheme
 - `host` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The requested host name
 - `url` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The request URL path
 - `status` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The HTTP status code that was returned to this request
 - `ip` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The IP address of the client that made the request (can be both IPv4 and IPv6)
 - `date` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> The time when the request was received
 - `responseTime` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The time in milliseconds that the request took to process
 - `hasEvents` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether any server-side error events occurred while processing this request
 - `requestHeaders` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> The request headers that were received
 - `requestBody` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> The request body that was received (likely parsed and formatted as JSON)
 - `responseHeaders` <code>[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> The headers that were returned by the server
 - `responseBody` <code>{type: "Buffer", data: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)[]} | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> The response body that was returned by the server in response to this request

<a name="interface-cloudnodeshortrequest"></a>

### Interface: `Cloudnode.ShortRequest`

Overview of a request

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID of the request
 - `method` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The request method (e.g. GET, POST, HEAD, etc.
 - `scheme` <code>"http" | "https"</code> The URL scheme
 - `host` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The requested host name
 - `url` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The request URL path
 - `status` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The HTTP status code that was returned to this request
 - `ip` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The IP address of the client that made the request (can be both IPv4 and IPv6)
 - `date` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> The time when the request was received
 - `responseTime` <code>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)</code> The time in milliseconds that the request took to process
 - `hasEvents` <code>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</code> Whether any server-side error events occurred while processing this request

<a name="interface-cloudnodetoken"></a>

### Interface: `Cloudnode.Token`

An authentication token

 - `id` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> The ID or key of the token
 - `created` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)</code> Date and time when this token was created
 - `expires` <code>[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [null](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null)</code> Date and time when this token expires. Null if it never expires.
 - `permissions` <code>[string[]](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)</code> Permission scopes that this token holds
 - `internal` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)</code> Whether this token is for internal use only, e.g. to power a session. In other words, an internal token is one that was **not** created by the client.
 - `metadata` <code>[Cloudnode.TokenMetadata](#interface-cloudnodetokenmetadata)</code> Additional metadata about this token

<a name="interface-cloudnodetokenmetadata"></a>

### Interface: `Cloudnode.TokenMetadata`

Token metadata

 - `note` <code>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)</code> A user-supplied note for this token




