# {php}IPAM Client for Node and the Browser
<!---
[![Build Status](https://secure.travis-ci.org/iaean/phpipam-js.png?branch=master)](http://travis-ci.org/iaean/phpipam-js)
[![NPM](https://nodei.co/npm/phpipam-js.png?downloads=false)](https://nodei.co/npm/phpipam-js/)
-->

This is a javascript client utilizing the [REST API][0] of {php}IPAM. It's running via node or in the browser. The async part is based on [Bluebird][4] Promises. For demonstration, there is a synchronous interface based on [synchronize.js][3] and [Node fibers(1)][2], too.

## Usage

Install [globally] via `npm`: `npm install [-g] phpipam-js`

### A note to CORS...

### The synchronous Interface

#### Note on RHEL/CentOS 6

By installing devtools-1.1 you can encounter problems while compiling and installing [Node fibers(1)][2] on those systems...

```bash
[~] >>wget http://people.centos.org/tru/devtools-1.1/devtools-1.1.repo
[~] >>yum install devtoolset-1.1
[~] >>scl enable devtoolset-1.1 bash
[~]# npm --user=root install -g synchronize
[~]# exit
```

## Examples

*	async.js
* dumpSync[1].js
*	index.html

## Contributing

* Your help to add new functionality is very welcome.
* [Grunt][1] is used as build system.
* In lieu of a formal styleguide, take care to maintain the existing coding style.
* Try to add unit tests for new or changed functionality and run ```grunt test```.
* Lint your code via ```grunt lint```.
* __Squash__ your changes to a single commit __before__ firing a Pull Request.

## License
Copyright (c) 2016 iaean  
Licensed under the MIT license.

[0]: http://phpipam.net/api-documentation/
[1]: http://gruntjs.com/
[2]: https://github.com/laverdet/node-fibers
[3]: http://alexeypetrushin.github.io/synchronize/
[4]: http://bluebirdjs.com/
