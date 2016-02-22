'use strict';

module.exports = function(ipamAPI) {
  var _ = require('underscore');
  var deepExtend = require('deep-extend');
  var Sync = require('synchronize');

  var request = require('./request.js');
  var unflatten = require('./unflatten.js');

  ipamAPI.prototype.reqSync = new Sync(request); // Synchronizify request

  ipamAPI.prototype.dumpSync = function(cb, o) {
    var self = this;

    Sync.fiber(function() { // Yee Haw...
      var options = deepExtend({}, o ? o : {
        fetchAddresses: false,
        fetchUsage: false
      });

      var token = self.reqSync(self.reqOpts('/user/', {
        method: 'POST'
      })).data.token;

      var domains = self.reqSync(self.reqOpts('/l2domains/', {
        method: 'GET'
      }, token)).data;

      _.each(domains, function(d) {
        var vlans = null;
        try {
          vlans = self.reqSync(self.reqOpts('/l2domains/' + d.id +
            '/vlans/', {
              method: 'GET'
            }, token)).data;
        }
        catch (e) {}
        if (vlans) d = deepExtend(d, { vlans: vlans });
      });

      var sections = self.reqSync(self.reqOpts('/sections/', {
        method: 'GET'
      }, token)).data;

      _.each(sections, function(s) {
        var subnets = null;
        try {
          subnets = self.reqSync(self.reqOpts('/sections/' + s.id +
            '/subnets/', {
              method: 'GET'
            }, token)).data;
        }
        catch (e) {}
        if (subnets) s = deepExtend(s, { subnets: subnets });
      });

      if (options.fetchAddresses || options.fetchUsage) {
        _.each(sections, function(s) {
          _.each(s.subnets, function(n) {
            if (options.fetchUsage) {
              var usage = null;
              try {
                usage = self.reqSync(self.reqOpts('/subnets/' +
                  n.id +
                  '/usage/', {
                    method: 'GET'
                  }, token)).data;
              }
              catch (e) {}
              if (usage) n = deepExtend(n, { usage: usage });
            }
            if (options.fetchAddresses) {
              var addresses = null;
              try {
                addresses = self.reqSync(self.reqOpts(
                  '/subnets/' +
                  n.id + '/addresses/', {
                    method: 'GET'
                  }, token)).data;
              }
              catch (e) {}
              if (addresses) n = deepExtend(n, { addresses: addresses });
            }
          });
        });
      }

      var dump = deepExtend({}, {
        sections: sections,
        domains: domains
      });

      _.each(dump.domains, function(d, i) {
        d.vlansById = {};
        _.each(d.vlans, function(v, j) {
          d.vlansById[v.vlanId] = [i, j];
        });
      });

      _.each(dump.sections, function(s, i) {
        if (s.subnets) {
          s.subnetsById = {};
          var flat = [];
          _.each(s.subnets, function(n, j) {
            s.subnetsById[n.id] = [i, j];
            flat.push(deepExtend({}, {
              id: n.id,
              masterSubnetId: n.masterSubnetId,
              index: j
            }));
          });
          s.subnetsNested = unflatten(flat);
        }
      });

      self.reqSync(self.reqOpts('/user/', {
        method: 'DELETE'
      }, token));

      return dump;
    }, cb);
  };

};
