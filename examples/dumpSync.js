#!/usr/bin/env node

'use strict';

var IPapi = require('./../lib/phpipam-js.js');
var config = require('./phpipam.json');
var api = new IPapi(config);

api.dumpSync(function(e, dump) { console.log(JSON.stringify(dump)); },
  { fetchAddresses: false, fetchUsage: false });
