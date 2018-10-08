# Changelog

This document outlines all notable changes to this project.

## [0.2.0] - 2018-10-02
### Added
+ A dependency on the `socks` npm module.
+ Proxy support for the `Client` class. If the `proxy` property is a proxy object, `connect` will route traffic through it.
+ The `lastServer` property to the Client class.
+ The optional `name` property to the `Account` interface. This is used for client logging.

### Removed
+ Optional `Socket` parameter from `Client` constructor.

## [0.1.2] - 2018-10-02
### Changed
+ Email and password are encrypted in the `connect` method
+ Bumped dependency version.

## [0.1.1] - 2018-09-27
### Changed
+ Bumped dependency version.

## [0.1.0] - 2018-09-27
Initial release.
