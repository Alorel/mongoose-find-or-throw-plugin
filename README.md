# mongoose-throw-if-not-found-plugin

[![NPM link](https://nodei.co/npm/mongoose-throw-if-not-found-plugin.svg?compact=true)](https://www.npmjs.com/package/mongoose-throw-if-not-found-plugin)

[![Build Status](https://travis-ci.org/Alorel/mongoose-find-or-throw-plugin.svg?branch=master)](https://travis-ci.org/Alorel/mongoose-find-or-throw-plugin)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/mongoose-find-or-throw-plugin/badge.svg?branch=master)](https://coveralls.io/github/Alorel/mongoose-find-or-throw-plugin?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/mongoose-find-or-throw-plugin.svg)](https://greenkeeper.io/)
![Supports Node >= 6](https://img.shields.io/badge/Node-%3E=6-brightgreen.svg)

Don't check for nulls when running your Mongoose 5 queries - let rejected promises do it for you.

Before:

```js
MyModel.findOne({foo: 'bar'})
  .then(doc => {
    if (!doc) {
      throw new Error('Doc not found');
    }
    
    useDoc(doc);
  });
```

After:

```js
MyModel.findOne({foo: 'bar'})
  .throwIfEmpty()
  .then(doc => {
    useDoc(doc);
  })
  .catch(e => {
    console.log(e.status); // 404
    console.log(e.message); // Not found
    console.log(e.name); // MongooseDocumentNotFoundError
  })
```

# Usage

Simply import the library once anywhere in your code:

```js
require('mongoose-throw-if-not-found-plugin');
```

It'll handle itself from there ;)

# TypeScript usage

While typings *are* provided, sometimes your IDE may fail to recognise them for code hints.
If this happens, simply add the import to the file you're using it from:

```typescript
import 'mongoose-throw-if-not-found-plugin';
```
