# {{config.name}} API SDK

{{{shield.version}}}
{{{shield.apiVersion}}}
{{{shield.build}}}
{{{shield.downloads}}}

{{pkg.description}}

## Install
```shell
npm install {{pkg.name}}
```

## Usage
### JavaScript
#### Node.js (ES6)
```js
import {{config.name}} from '{{pkg.name}}';

const {{config.instanceName}} = new {{config.name}}("token_YourSecretToken123");

// get a newsletter
const newsletter = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
// get response status code
console.log(newsletter._response.status); // 200
```

#### Node.js (CommonJS)
```js
const {{config.name}} = require('{{pkg.name}}');

const {{config.instanceName}} = new {{config.name}}("token_YourSecretToken123");

// get a newsletter
const newsletter = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
console.log(newsletter._response.status); // 200
```

#### Browser
Download the browser SDK from `browser/{{config.name}}.js` or use our hosted version.
```html
<script src="{{{config.browserSdkUrl}}}"></script>
<script>
const {{config.instanceName}} = new {{config.name}}();

// get a newsletter
const newsletter = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
console.log(newsletter._response.status); // 200
</script>
```
> **Warning**: You most likely don't want to set your private token in a public front-end website, as this will allow anyone who sees your front-end JavaScript code to use it for possibly malicious purposes. We advise you use a back-end server to proxy requests to our API, so you do not expose your token to the public.

### TypeScript
```ts
import {{config.name}} from '{{pkg.name}}';

const {{config.instanceName}} = new {{config.name}}("token_YourSecretToken123");

// get a newsletter
const newsletter: {{config.name}}.Newsletter = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
```
If you want to access response metadata (headers, status code, etc.), use `{{config.name}}.ApiResponse<T>`, e.g.:
```ts
const newsletter: {{config.name}}.ApiResponse<{{config.name}}.Newsletter> = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
console.log(newsletter.id); // newsletter_123asd
console.log(newsletter._response.status); // 200
```

{{{docMD}}}
