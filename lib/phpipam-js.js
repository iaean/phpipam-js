/*
 * phpipam-js
 * https://github.com/iaean/phpipam-js
 *
 * Copyright (c) 2016 iaean
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var events = require('events');
var deepExtend = require('deep-extend');

function ipamAPI(options) {
  // jshint -W040
  if (!(this instanceof ipamAPI)) return new ipamAPI(options); // jscs:ignore requireCapitalizedConstructors
  var self = this;
  // jshint +W040
  self.agentPool = { maxSockets: 5 };
  self.reqDefaults = {
    request: {
      method: 'GET',
      pool: self.agentPool,
      headers: {},
      strictSSL: false,
      json: true
    }
  };
  if (!options)
    throw 'Please specify baseURI, username and password...';
  if (!options.baseURI || !options.username || !options.password)
    throw 'Please specify baseURI, username and password...';
  self.options = deepExtend({
    base: options.baseURI,
    user: options.username,
    pass: options.password }, self.reqDefaults, options);

  // self.init();
  self.token = null;
  self.session = null;
  self.openRequests = [];
}
util.inherits(ipamAPI, events.EventEmitter);

ipamAPI.prototype.init = function() {
  var self = this;
  self.token = null;
  self.session = null;
  self.openRequests = [];
};

ipamAPI.prototype.reqOpts = function(c, o, t) {
  var self = this;
  if (!t) {
    return deepExtend({}, self.options.request, {
      url: self.options.base + c,
      auth: {
        user: self.options.user,
        pass: self.options.pass,
        sendImmediately: true
      }
    }, o ? o : {});
  } else {
    return deepExtend({}, self.options.request, {
      url: self.options.base + c,
      headers: { 'phpipam-token': t }
    }, o ? o : {});
  }
};

require('./sync.js')(ipamAPI);
require('./async.js')(ipamAPI);

module.exports = ipamAPI;
