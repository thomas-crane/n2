# n2/net

The net module provides an event based implementation of the RotMG packet protocol. The packet interface uses two packet buffers, both of which utilise internal resizing to avoid unnecessary buffer allocations.

The module also provides implementations for almost all packets used by RotMG. This provides a strongly typed way of working with the traffic between a client and the game server.

## Install

[![npm version](https://badge.fury.io/js/%40n2%2Fnet.svg)](https://badge.fury.io/js/%40n2%2Fnet)

```bash
npm install @n2/net
```

## Use

This module can be used to build clientless applications from the network layer up. It is a good starting point for clientless applications which implement their own custom client logic. Note that this module provides the networking facilities, but doesn't inherently do anything with them. If you are looking for a ready to use lightweight client, use the n2/core module.

Before the packet interface can be used, the exported `Mapper` class must be used to map the packet types to their IDs.
If the packet types are not mapped to their IDs, the packet interface won't know which packet type to create when it receives a packet with a certain ID.

The mapper's static `mapIds` method expects a `PacketIdMap` as an argument. A packet ID map is simply a JSON object which uses the packet IDs as the keys, and those ID's packet types as the values. For example,

```json
{
  "0": "FAILURE",
  "10": "HELLO",
  "34": "CREATE_SUCCESS"
}
```

Will allow the packet interface to create `FailurePacket`s, `HelloPacket`s and `CreateSuccessPacket`s whenever they are received.

The values in the packet ID map should correspond to the values found in the exported `PacketType` enum. If a value is mapped which is not found in this enum a warning will be produced, but it will be mapped anyway.

The n2/updater module is capable of producing a valid packet ID map, so it is recommended to use this module to get the latest packet IDs. They can be stored in a JSON file on the disk which can be `require`d and mapped.

```javascript
const { Mapper } = require('@n2/net');
const packetIds = require('./packets.json');

Mapper.mapIds(packetIds);
```

Once the packet IDs have been mapped, the packet interface can then be created and used to interact with the game server.

```javascript
const { Mapper, PacketIO, PacketType, HelloPacket, LoadPacket } = require('@n2/net');
const { Socket } = require('net');
const packetIds = require('./packets.json');

// map the packet IDs.
Mapper.mapIds(packetIds);

// create the packet interface.
const io = new PacketIO(new Socket());

// initiate the connection and begin the hello handshake.
io.socket.connect(2050, 'localhost', () => {
  const hello = new HelloPacket();
  hello.buildVersion = 'X29.0.1';
  hello.gameId = -2;
  hello.guid = 'example@email.com';
  hello.password = '123456';
  hello.keyTime = 0;
  hello.key = [];
  hello.gameNet = 'rotmg';
  hello.playPlatform = 'rotmg';
  io.send(hello);
});

// listen for the hello packet reply in order to complete the handshake.
io.on(PacketType.MAPINFO, () => {
  const load = new LoadPacket();
  load.charId = 10;
  io.send(load);
});

io.on(PacketType.CREATE_SUCCESS, () => {
  console.log('Client is now connected to the game server.');
});

```
