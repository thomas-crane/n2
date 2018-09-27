# n2/common

This module is home to interfaces and classes which are used throughout the other n2 modules.
Most of the interfaces represent entities from RotMG, however some are used to represent data structures used by the classes in this module.

## Install

[![npm version](https://badge.fury.io/js/%40n2%2Fcommon.svg)](https://badge.fury.io/js/%40n2%2Fcommon)

```bash
npm install @n2/common
```

## Use

There are three main "submodules" provided by the common modules.

+ Http
+ Logging
+ Models

### Http

The exported `HttpClient` class provides a basic promise-based way of making web requests. The http client will include standard request headers with any request, and will automatically unzip any gzipped responses.

```javascript
const { HttpClient, Endpoints } = require('@n2/common');

// query parameters can be included in the request options.
const requestOptions = {
  query: { guid: 'example@email.com', password: '123456' }
};

HttpClient.get(Endpoints.CHAR_LIST, requestOptions).then((data) => {
  console.log('Fetched account info.');
  const accInfoXML = data.toString();
});
```

The http client will normally return the response as a `Buffer` object. A writable stream can optionally be provided as part of the `requestOptions`, and if one is provided, the response will be piped to the stream. In this case, the promise will be resolved with `undefined` instead of the data buffer.

This means that

```javascript
const { HttpClient, Endpoints } = require('@n2/common');
const fs = require('fs');

const writeStream = fs.createWriteStream('./ground-types.json');

HttpClient.get(Endpoints.STATIC_DRIPS + '/current/json/GroundTypes.json').then((data) => {
  writeStream.write(data);
  writeStream.end();
});
```

is the same as

```javascript
const { HttpClient, Endpoints } = require('@n2/common');
const fs = require('fs');

const writeStream = fs.createWriteStream('./ground-types.json');

HttpClient.get(Endpoints.STATIC_DRIPS + '/current/json/GroundTypes.json', {
  stream: writeStream
});
```

### Logging

The `Logger` class provides a logging mechanism in the form of a logger chain. Custom loggers can be added to the chain as long as they adhere to the `LogProvider` interface.

In TypeScript, custom loggers can simply inherit from `LogProvider`, however in JavaScript care will have to be taken to ensure the custom loggers have the required methods.

```typescript
import { LogProvider, LogLevel } from '@n2/common';

class MyCustomLogger implements LogProvider {

  // inherited method from LogProvider.
  log(sender: string, message: string, level: LogLevel): void {
    console.log(`[${sender}] ${message} (${LogLevel[level] || 'no level'})`);
  }
}
```

```typescript
import { Logger, LogLevel } from '@n2/common';
import { MyCustomLogger } from './my-custom-logger';

Logger.addLogger(new MyCustomLogger());

Logger.log('Test', 'Hello, World!', LogLevel.Debug);
// [Test] Hello, World! (Debug)
```

More loggers can be added to the chain. Calls to `Logger.log` will call the `log` method of each logger in the chain in the order that they were added.

```typescript
Logger.addLogger(new MyCustomLogger());
Logger.addLogger(new MyCustomLogger());
Logger.addLogger(new MyCustomLogger());

Logger.log('Test', 'Hello 3 times.', LogLevel.Message);
// [Test] Hello 3 times. (Message)
// [Test] Hello 3 times. (Message)
// [Test] Hello 3 times. (Message)
```

### Models

The common module exports a handful of interfaces and enums which represent data structures and values used throughout clientless applications for RotMG. Some notable examples include the `PlayerData` interface which represents a player entity, and the `Endpoints` enum which contains commonly used HTTP endpoints.
