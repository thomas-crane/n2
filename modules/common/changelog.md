# Changelog

This document outlines all notable changes to this project.

## [0.1.1] - 2018-10-08
### Changed
+ Refactored http code to reduce duplication.
+ Errors are no longer thrown by the `HttpClient`. They now cause the returned promise to be rejected.

## [0.1.0] - 2018-09-27
Initial release.
