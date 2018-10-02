# n2

A collection of modules for building clientless applications for Realm of the Mad God.

[![Build Status](https://travis-ci.org/thomas-crane/n2.svg?branch=master)](https://travis-ci.org/thomas-crane/n2)

## Contents

+ [Foreword](#foreword)
+ [Installing](#installing)
+ [Building](#building)
  + [Other gulp tasks](#other-gulp-tasks)
+ [Modules](#modules)
+ [Use](#use)
+ [Acknowledgements](#acknowledgements)

## Foreword

This project is still in early development. First and foremost, this means that breaking changes are going to be quite common. While the project is still on v0, a breaking change will only constitute a minor version increment. When v1.0.0 is released, all breaking changes will go back to being a major version increment.

Being in early development also means that documentation (including usage guides) may not be as comprehensive until later in the development process.

As always, feel free to report bugs or submit feature requests on the GitHub issues page.

## Installing

First, clone this repository.

```bash
git clone https://github.com/thomas-crane/n2
```

Change the current working directory of the console to the n2 folder.

```bash
cd n2
```

Then install the dependencies.

```bash
npm install
```

## Building

```bash
npm run gulp
```

Note that if [`gulp-cli`](https://gulpjs.com/) is globally installed, this, and subsequent mentions of `npm run gulp` can simply be replaced with

```bash
gulp
```

This will clean and rebuild all n2 modules. To rebuild or clean an individual module, its name can be provided in the `build` gulp script.

```bash
npm run gulp build:core
```

Will rebuild just the n2/core module.

### Other gulp tasks

There are several other gulp tasks which the main build tasks are composed of.

```bash
gulp clean
```

Will delete the build artifacts in every module. A single module can be cleaned by providing its name, e.g. `gulp clean:net`.

```bash
gulp compile
```

Will compile all modules. Like the other commands, a single module can be compiled by using its name. e.g. `gulp compile:common`.

Note that because of dependencies, the build order is

1. n2/common
2. n2/net
3. n2/updater & n2/core

n2/updater and n2/core are able to compile in parallel, however they both depend on n2/common and n2/net.

Each module, except for n2/updater, hs an npm script which is used to generate the `index.ts` files. It can be invoked by using

```bash
npm run index
```

From the module's root folder.

The gulp commands are mirrored in `package.json` to provide npm script commands to invoke the gulp tasks. This means that

+ `npm run clean` is the same as `npm run gulp clean`
+ `npm run compile` is the same as `npm run gulp compile`
+ `npm run build` is the same as `npm run gulp build`

The only difference is that module names cannot be provided with the npm script commands, e.g. `npm run build:net` will not work.

There are also a few other scripts in the `package.json` scripts,

+ `npm run docs` - This runs TypeDoc to generate the API documentation.
+ `npm test` - This runs all of the unit tests with Mocha.

## Modules

n2 contains several modules which can be used separately or in combination with one another to build clientless applications.

### [`@n2/updater`](modules/updater/readme.md)

The updater module contains a utility class for downloading assets, and extracting packet IDs from the game client.

### [`@n2/core`](modules/core/readme.md)

The core module is a good starting point for a clientless application.  It contains a lightweight client class which can be extended.

### [`@n2/net`](modules/net/readme.md)

The net module contains all networking related code for clientless applications.  This includes packets and a packet IO class.

### [`@n2/common`](modules/common/readme.md)

The common module contains interfaces and other classes which are used throughout other n2 modules.

## Use

Each module has its own readme where you will find more information about using the specific modules. As a brief overview,

+ n2/common contains the http and logger utilities, and a handful of interfaces and classes that represent RotMG entities.
+ n2/net contains all of the packets and networking code. This is a good starting point for applications with custom client implementations.
+ n2/updater contains an updater utility which can download the game assets and client, and extract the latest packet IDs.
+ n2/core contains several parser utitlities, and most importantly a lightweight client class. This class has bare minimum to stay connected, and a few convenient properties. It also contains extensions to this client through the stdlib.

## Acknowledgements

This project uses the following open source software

+ [JPEXS Free Flash Decompiler](https://github.com/jindrapetrik/jpexs-decompiler)
