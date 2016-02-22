#!/usr/bin/env node

'use strict';

var IPapi = require('./../lib/phpipam-js.js');
var config = require('./phpipam.json');
var api = new IPapi(config);

api.login(); //.catch(function(e) {console.error(e);});

api.fetchNet('10.64.64.0/25')
  .then(function(r) {
    console.log(r); });

api.fetchNets()
  .then(function(r) {
    console.log(r); });

api.fetchVlans()
  .then(function(r) {
    console.log(r); });

api.request('/user/')
  .then(function(r) {
    console.log(r.data); });

api.logout(); //.catch(function(e) {console.error(e);});
