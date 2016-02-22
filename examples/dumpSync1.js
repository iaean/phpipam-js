#!/usr/bin/env node

'use strict';

var _ = require('underscore');
var IPapi = require('./../lib/phpipam-js.js');
var config = require('./phpipam.json');
var api = new IPapi(config);

api.dumpSync(function(e, dump) {
  var vlans = {};
  _.each(dump.domains, function(d) {
    _.each(d.vlansById, function(v, k) {
      vlans[k] = v;
    });
  });

  function printSubnet(n, i, s) {
    var net = dump.sections[i].subnets[n.index];
    var vlan = net.vlanId && net.vlanId > 0 ? dump.domains[vlans[net.vlanId]
      [0]].vlans[vlans[net.vlanId][1]].number : null;
    var des = !net.subnet ? net.description : net.subnet + '/' + net.mask +
      (vlan ? ' [VLAN:' + vlan + ']' : '');

    console.log(s + '|- ' + des + (net.usage ? ' (Utilization:' + (100 -
      net.usage.freehosts_percent).toFixed(2) + '%)' : '')); // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    if (n.subnets) {
      _.each(n.subnets, function(x) {
        printSubnet(x, i, s + '   ');
      });
    }
  }

  console.log('### Networks by Section');
  _.each(dump.sections, function(s, i) {
    console.log(s.name);
    _.each(s.subnetsNested, function(n) {
      printSubnet(n, i, ' ');
    });
  });
  console.log('### VLANs by L2Domain');
  _.each(dump.domains, function(d) {
    console.log(d.name + ': ' + _.pluck(d.vlans, 'number').join(','));
  });
}, {
  fetchAddresses: false,
  fetchUsage: false
});
