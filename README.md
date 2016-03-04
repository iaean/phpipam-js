# {php}IPAM Client for Node and the Browser
<!---
[![Build Status](https://secure.travis-ci.org/iaean/phpipam-js.png?branch=master)](http://travis-ci.org/iaean/phpipam-js)
[![NPM](https://nodei.co/npm/phpipam-js.png?downloads=false)](https://nodei.co/npm/phpipam-js/)
-->

This is a javascript client utilizing the [REST API][0] of {php}IPAM.
It's running via node or in the browser. The async part is based on
[Bluebird][4] Promises. For demonstration, there is a synchronous
interface based on [synchronize.js][3] and [Node fibers(1)][2], too.
HTTP work by [request][5].

## Usage

Install [globally] via `npm`: `npm install [-g] phpipam-js`

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

You must provide a configured API key and a suitable account.
You do this via the API and User management interface of {php}IPAM.

App id | App code | App permissions | App security | Comment
------ | -------- | --------------- | ------------ | -------
apiKeyAppId | Not used | Read | SSL | NodeJS Client

#### .login()
#### .request(controllerPath, [configObject])
#### .logout()

#### .fetchNet(cidr)
#### .fetchNets()
#### .fetchVlans()

### Note on [CORS][7] for browsers

{php}IPAM isn't [CORS enabled][8] by default. This blocks the usage for browsers.
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

After that, the browser will fire a so-called **preflight** to each API URI before accessing it.
This is done by touching the URI via `OPTIONS`. The touch __MUST__ return success.
Unfortunately this is actually not true for all {php}IPAM API controllers.
To workaround this put the following lines to your `api/.htaccess`:
```apache
RewriteEngine On
# CORS preflight workaround
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ README [L]
```
This will map all `OPTIONS` preflights to the api `README` file.
Hence the server returns success for all preflights.
The drawback is, that the real `OPTIONS` API calls are hidden to the client now.

### The synchronous Interface



#### .dumpSync(callback, [configObject])

<!---
 callback: `function(e, dump)`
 configObject: `{ fetchAddresses: false, fetchUsage: true }`
-->

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

* async.js - call some functions
* dumpSync.js - dumps a JSON blob of all networks and VLANs
* dumpSync1.js - prints the network tree based on a dump
* index.html   
  Use [Browsersync][6], run `browser-sync start --server --host A.B.C.D --index examples/index.html`
  and point your browser to `A.B.C.D:3000` or `A.B.C.D:3001` to play with a small widget example for the brwoser.

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
