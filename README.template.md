# {{config.name}} API SDK

{{{shield.version}}}
{{{shield.apiVersion}}}

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
```

#### Node.js (CommonJS)
```js
const {{config.name}} = require('{{pkg.name}}');

const {{config.instanceName}} = new {{config.name}}("token_YourSecretToken123");

// get a newsletter
const newsletter = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
```

#### Browser
Coming soon!

### TypeScript
```ts
import {{config.name}} from '{{pkg.name}}';

const {{config.instanceName}} = new {{config.name}}("token_YourSecretToken123");

// get a newsletter
const newsletter: {{config.name}}.Newsletter = await {{config.instanceName}}.newsletter.get("newsletter_123asd");
```

{{{docMD}}}
