# {php}IPAM Client for Node and the Browser
<!---
[![Build Status](https://secure.travis-ci.org/iaean/phpipam-js.png?branch=master)](http://travis-ci.org/iaean/phpipam-js)
[![NPM](https://nodei.co/npm/phpipam-js.png?downloads=false)](https://nodei.co/npm/phpipam-js/)
-->

This is a javascript client utilizing the [REST API][0] of {php}IPAM.
It's running via node or browser. The async part is based on
[Bluebird][4] Promises. For demonstration, there is a synchronous
interface based on [synchronize.js][3] and [Node fibers(1)][2], too.
HTTP work by [request][5].

## Usage

Install [globally] via `npm`: `npm install [-g] phpipam-js`

:exclamation: Note: It's not published, yet.

```javascript
var IPapi = require('phpipam-js');
var api = new IPapi({
  baseURI: 'https://ip.example.com/ipv/api/apiKeyAppId',
  username: 'ipam.api',
  password: 'secret' });
api.login();
api.request('/user/').then(function(r) { console.log(r.data); });
api.logout();
```
```html
<html><head/><body>
  <script src="/phpipam.min.js"></script>
  <script>
    var api = new IPapi({
      baseURI: 'https://ip.example.com/ipv/api/apiKeyAppId',
      username: 'ipam.api',
      password: 'secret' });
    api.login();
    api.request('/user/').then(function(r) { console.log(r.data); });
    api.logout();
  </script>
</body></html>
```
You must provide a valid API key and a suitable account.
Consult the API and User management interface of {php}IPAM.

#### .login()

Login to API, using credentials applied to constructor (see above).
Returns a promise for the login request. But you can use it in a synchronous
style. Subsequent queries _waiting_ for successfull login (see examples, below).

#### .logout()

Logout from API. Returns a promise for the logout request. But you can use
it in a synchronous style. Its _waiting_ for outstanding queries (see examples, below).

#### .request(controllerPath, [configObject])

Makes an API call. Returns a promise for the request.

###### Arguments

* `controllerPath` - Target API controller URI. Its append to `baseURI`
* `configObject` - Configuration object directly fed to [request()][5]. Defaults to `{ method: 'GET' }`.

#### .fetchNet(cidr)

Queries for a network. If found, queries for associated VLAN, child networks
and parent network, too. Returns resulting JSON blob in a promise.

###### Arguments

* `cidr` - A network in CIDR notation e.g. `10.0.1.0/24`.

#### .fetchNets()

Queries for all networks in all sections.
Returns resulting JSON blob in a promise.

#### .fetchVlans()

Queries for all VLANs in all L2 domains.
Returns resulting JSON blob in a promise.

## Note on [CORS][7] for browsers

{php}IPAM API isn't [CORS enabled][8] by default. This blocks browsers.
Put the following on top of your `api/.htaccess` to enable CORS:
```apache
SetEnvIf Origin (.*) AccessControlAllowOrigin=$1
SetEnvIf Access-Control-Request-Method (.*) AccessControlAllowMethods=$1
SetEnvIf Access-Control-Request-Headers (.*) AccessControlAllowHeaders=$1
Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
Header always set Access-Control-Allow-Methods %{AccessControlAllowMethods}e env=AccessControlAllowMethods
Header always set Access-Control-Allow-Headers %{AccessControlAllowHeaders}e env=AccessControlAllowHeaders
Header always set Access-Control-Allow-Credentials true
# Header always set Access-Control-Max-Age 86400
```

Browsers will fire a so-called *preflight* to each API URI before accessing it.
This is done by touching the URI via `OPTIONS`. The touch __MUST__ return success.
Unfortunately this is actually not true for all {php}IPAM API controllers.
Some of them throwing with HTTP != 2xx. To workaround this, put the following lines
to your `api/.htaccess`:
```apache
RewriteEngine On
# CORS preflight workaround
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ README [L]
```
This will map all `OPTIONS` preflights to the `api/README` file.
The server returns success for all preflights now.
Hence one drawback is, that the real `OPTIONS` API calls are hidden to the client now.

## The synchronous Interface

For ECMA/Javascript beginners it's sometimes hard to keep the async nonblocking nature
of this platform in mind. It seems to be a pain to fizzle out with callback based or event
driven models, just for Sysadmins. The most stuff they know is synchronous and blocking.

One solution to come up against that hazard is called [Node fibers(1)][2]. With a wrapper
like [synchronize.js][3] you can synchronizify almost any async function and run it
synchronously inside a fiber (see examples, below). Feels like Perl, Python, Shell...

Because fibers are a node plugin, they are not available in browsers.

#### .dumpSync(callback, [configObject])

Dumps all networks from all sections and all VLANs from all L2 domains.
Calls `callback` with resulting JSON blob.

###### Arguments

* `callback(error, dump)` - A _nodeback_ callback. Resulting JSON blob applied to `dump`.
* `configObject` - Configuration object. Defaults to `{ fetchAddresses: false, fetchUsage: false }`.
   Set to `true` to fetch addresses and/or usage of each network, too.

#### Note on RHEL/CentOS 6

By installing devtools-1.1 you can encounter problems while compiling and
installing [Node fibers(1)][2] on those systems...

```bash
[~]>> wget http://people.centos.org/tru/devtools-1.1/devtools-1.1.repo
[~]>> yum install devtoolset-1.1
[~]>> scl enable devtoolset-1.1 bash
[~]# npm --user=root install -g synchronize
[~]# exit
```

## Examples

* [async.js](examples/async.js) - call some functions
* [dumpSync.js](examples/dumpSync.js) - dumps a JSON blob of all networks and VLANs
* [dumpSync1.js](examples/dumpSync1.js) - prints the network tree based on a dump
* [index.html](examples/index.html)   
  Use [Browsersync][6], run
  `browser-sync start --server --host A.B.C.D --index examples/index.html`
  and point your browser to `A.B.C.D:3000` or `A.B.C.D:3001` to play with a small widget example.

## Contributing

* Your help to add new functionality is very welcome.
* [Grunt][1] is used as build system.
* In lieu of a formal styleguide, take care to maintain the existing coding style.
* Try to add unit tests for new or changed functionality and run `grunt test`.
* Lint your code via `grunt lint`.
* __Squash__ your changes to a single commit __before__ firing a Pull Request.

## License
Copyright (c) 2016 iaean  
Licensed under the MIT license.

[0]: http://phpipam.net/api-documentation/
[1]: http://gruntjs.com/
[2]: https://github.com/laverdet/node-fibers
[3]: http://alexeypetrushin.github.io/synchronize/
[4]: http://bluebirdjs.com/
[5]: https://github.com/request/request
[6]: https://browsersync.io
[7]: https://www.w3.org/TR/cors/
[8]: https://www.w3.org/wiki/CORS_Enabled
