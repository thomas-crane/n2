# n2/updater

The updater module can be used to download the latest packet ids and assets from the game.

## Install

[![npm version](https://badge.fury.io/js/%40n2%2Fupdater.svg)](https://badge.fury.io/js/%40n2%2Fupdater)

```bash
npm install @n2/updater
```

If you intend to use the `unpackSwf` method, you will also need to install a Java Runtime Environment and add it to your PATH so that it may be invoked from the command line.

This package has been tested using [JRE 8u181](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html).

## Use

The updater can be imported using the CommonJS style

```javascript
const Updater = require('@n2/updater');
```

Or using the ES style

```typescript
import Updater from '@n2/updater';
```

### Downloading assets

For downloading assets, the updater has two methods available.

+ `getGroundTypes()` - Fetches the `GroundTypes.json` resource.
+ `getObjects()` - Fetches the `Objects.json` resource.

Both of these download the resources into an in-memory buffer. They return a promise which resolves when the download has completed.

```javascript
const Updater = require('@n2/updater');

console.log('Downloading ground types.');
Updater.getGroundTypes().then((groundTypes) => {
  console.log('Downloaded ground types.');
}).catch((error) => {
  console.log('Error while downloading ground types.');
  console.error(error);
});
```

A `WriteStream` object can be used to save the buffer contents to the disk.

```javascript
const Updater = require('@n2/updater');
const fs = require('fs');
const path = require('path');

// create the stream.
const stream = fs.createWriteStream(path.join(__dirname, 'ground-types.json'));

// download the ground types.
Updater.getGroundTypes().then((groundTypes) => {

  // write the buffer to the stream, then close it.
  stream.end(groundTypes);
  console.log('Ground types saved to ./ground-types.json');
});
```

Since writing the buffer contents to the disk is extremely common, the `getGroundTypes` method accepts a writable stream as an argument for convenience. If one is provided, the data will be piped int the stream, and it will be automatically closed when the download has finished.

```javascript
const Updater = require('@n2/updater');
const fs = require('fs');
const path = require('path');

// create the stream.
const stream = fs.createWriteStream(path.join(__dirname, 'ground-types.json'));

// download the ground types, but pass the stream in this time.
Updater.getGroundTypes(stream).then((groundTypes) => {
  // no need to write to the stream this time.
  console.log('Ground types saved to ./ground-types.json');
});
```

A stream can also be passed as an optional argument to the `getClient` and `getObjects` methods.

This is a lightweight example. It is a good idea to attach an event listener to the `error` event of the write stream. If there is no event listener attached when an error occurs the program will be terminated.

### Downloading the client

There are several methods which can are used to download the game client and extract the packet IDs from it.
All of these methods return promises which resolve when the operations have been completed.

+ `getRemoteClientVersion()` - Fetches the latest client version number.
+ `getClient(version: string)` - Fetches the game client with the specified version. Downloads the client to an in-memory buffer.
+ `unpackSwf(swfPath: string)` - Decompiles the file located at `swfPath`.

There are two additional methods which don't return promises.

+ `makeGSCPath(base: string)` - Creates a filepath from `base` to the `GameServerConnection.as` file.
+ `extractPacketInfo(source: string)` - Extracts the packet IDs from the source of a `GameServerConnection.as` file.

```javascript
const Updater = require('@n2/updater');
const fs = require('fs');
const path = require('path');

// create the stream.
const stream = fs.createWriteStream(path.join(__dirname, 'client.swf'));

// get the current client version.
Updater.getRemoteClientVersion().then((version) => {

  // download the latest client.
  return Updater.getClient(version, stream);
}).then((client) => {

  // unpack the client.
  return Updater.unpackSwf(path.join(__dirname, 'client.swf'));
}).then(() => {

  // get the contents of the GameServerConnection.as file.
  const pathToGSC = Updater.makeGSCPath(path.join(__dirname, 'decompiled'));
  const gscFileContents = fs.readFileSync(pathToGSC, { encoding: 'utf8' });

  // extract the packet info and save it to the disk.
  const packets = Updater.extractPacketInfo(gscFileContents);
  fs.writeFileSync(path.join(__dirname, 'packets.json'), JSON.stringify(packets));
});
```
