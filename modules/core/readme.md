# n2/core

The core module provides a rich set of utilities which can be used to build functional clientless applications for RotMG with a minimal amount of additional code.

## Install

```bash
npm install @n2/core
```

## Use

Similarly to the common module, this module is logically divided into 4 modules

+ Models
+ Parsers
+ Resources
+ Standard library

The core module also has a root level export, which is the Client class.

### Client

The client class is a lightweight client which can be used as a base for extended clients, or on it's own for simple applications. The client is capable of maintaining a connection with the game server, and provides a handful of properties which are commonly used in clientless applications. These properties include the client's player data, the map tiles, the client's object ID, and the clients position.

```javascript
const { Client } = require('@n2/core');
const { Mapper } = require('@n2/net');

// map packet ids.
Mapper.mapIds(require('./packets.json'));

// create client.
let client = new Client({
  guid: 'example@email.com',
  password: '12345'
});

// connect to nexus.
client.connect('52.59.198.155', {
  buildVersion: 'X29.0.1',
  gameId: -2,
  characterId: 1
});

```

### Models

The models exported by this module represent high level data structures which are used throughout the core module. There are representations of RotMG accounts, characters, servers, maps and more.

### Parsers

The core module exports a handful of static parser classes which can be used to interpret data about servers and accounts. Most RotMG endpoints return XML data, so the parsers can be used to translate the data into strongly typed JSON.

```javascript
const { HttpClient, Endpoints } = require('@n2/common');
const { ServerParser, AccountParser } = require('@n2/core');

HttpClient.get(Endpoints.CHAR_LIST).then((xml) => {
  const servers = ServerParser.parse(xml);
  console.log(`Parsed ${servers.length} servers.`);
});

HttpClient.get(Endpoints.CHAR_LIST, {
  query: { guid: 'example@email.com', password: '12345' }
}).then((xml) => {
  const accInfo = AccountParser.parseAccountInfo(xml);
  accInfo.characters = AccountParser.parseCharacters(xml);

  console.log(`${accInfo.characters.length} out of ${accInfo.characterSlots} filled.`);
});

```

### Resources

The exported `ResourceLib` class is a static class which is used to facilitate the loading of game resources. It provides a strongly typed way of working with the JSON data which can be loaded from the objects and ground types JSON assets.

### Standard library

The standard library consists of classes which extend the Client class in order to provide some extra functionality. These extension classes can be used in place of the Client class, and can be further extended to create a more functional client.

The classes included in the standard library are

#### `PlayerTrackerClient`

The player tracker client extends the Client class to provide the functionality of keeping track of other players in the current map. The class adds two new features to the client,

+ The `players: PlayerData[]` array which, at any given time, contains the information of the other players in the current map.
+ An event emitter which provides two events,
  + `'enter'`, which is fired when a player enters the current map and has a listener signature of `(player: PlayerData) => void`, and
  + `'leave'`, which is fired whena player leaves the map. It also has a listener signature of `(player: PlayerData) => void`.

```javascript
const { PlayerTrackerClient } = require('@n2/core');
const { Mapper } = require('@n2/net');

// map packet ids.
Mapper.mapIds(require('./packets.json'));

// create client.
let client = new PlayerTrackerClient({
  guid: 'example@email.com',
  password: '12345'
});

// connect to nexus.
client.connect('52.59.198.155', {
  buildVersion: 'X29.0.1',
  gameId: -2,
  characterId: 1
});

client.on('enter', (player) => {
  console.log(`${player.name} entered the server.`);
});

```
