# Changelog

This document outlines all notable changes to this project.

## [0.3.1] - 2018-10-09
### Changed
+ Bumped dependency version.

## [0.3.0] - 2018-10-08
### Added
+ The method `attach(socket: Socket)` to the Packet IO class.
+ The method `detach()` to the Packet IO class.
+ A new property `isSupporter` to the `TextPacket`.

## [0.2.1] - 2018-10-08
### Added
+ A new event `packet` which is emitted for any packet received. Events for specific types are still emitted, and will be emitted before the `packet` event is emitted.

### Changed
+ Bumped dependency version.

## [0.2.0] - 2018-10-02
### Added
+ `read` implementations for all outgoing packets.
+ `write` implementations for all incoming packets.
+ The `Packet` interface.

### Removed
+ The `IncomingPacket` and `OutgoingPacket` interfaces.

### Changed
+ The Hello packet no longer RSA encrypts the `guid` and `password` properties upon writing.

## [0.1.1] - 2018-09-27
### Changed
+ Bumped dependency version.

## [0.1.0] - 2018-09-27
Initial release.
