# {php}IPAM Client for Node and the Browser
<!---
[![Build Status](https://secure.travis-ci.org/iaean/phpipam-js.png?branch=master)](http://travis-ci.org/iaean/phpipam-js)
[![NPM](https://nodei.co/npm/phpipam-js.png?downloads=false)](https://nodei.co/npm/phpipam-js/)
-->

## Getting Started
Install the module (globally) via: `npm install [-g] phpipam-js`

## Usage

### The sync Interface

#### Note on RHEL/CentOS 6

By installing devtools-1.1 you can encounter problems while compiling and installing [Node fibers(1)](https://github.com/laverdet/node-fibers) on those systems...

```bash
[~] >>wget http://people.centos.org/tru/devtools-1.1/devtools-1.1.repo
[~] >>yum install devtoolset-1.1
[~] >>scl enable devtoolset-1.1 bash
[~]# npm --user=root install -g synchronize
[~]# exit
```

## Examples

*	async.js
* dumpSync.js
*	dumpSync1.js

## Contributing

* [Grunt](http://gruntjs.com/) is used as build system.
* In lieu of a formal styleguide, take care to maintain the existing coding style.
* Try to add unit tests for new or changed functionality and run ```grunt test```.
* Lint your code via ```grunt lint```.
* __Squash__ your changes to a single commit __before__ firing a Pull Request.

## License
Copyright (c) 2016 iaean  
Licensed under the MIT license.
