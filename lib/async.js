'use strict';

module.exports = function(ipamAPI) {
  var _ = require('underscore');
  var deepExtend = require('deep-extend');
  var Promise = require('bluebird');
  Promise.config({
    warnings: true,
    cancellation: true
  });

  var request = require('./request.js');

  ipamAPI.prototype.reqProm = new Promise.promisify(request); // Promisify request

  ipamAPI.prototype.login = function() { // API login
    var self = this;
    if (self.session) return self.session;

    self.session = self.reqProm(self.reqOpts('/user/', {
      method: 'POST'
    }));
    return self.session.then(function(data) {
      self.token = {};
      self.token.token = data.data.token;
      self.token.expires = data.data.expires;
      console.log(data.data.token + ': Logged in.');
      process.once('beforeExit', function() {
        self.logout(true);
      });
    });
  };

  ipamAPI.prototype.request = function(c, o) { // API query
    var self = this;
    if (!self.session)
      return Promise.reject(new Error('Unable to request ' +
        self.options.base + ' [Invalid login session]'));

    return self.session.then(function() {
      var q = self.reqProm(self.reqOpts(c, o, self.token.token));
      self.queueRequest(q);
      return q;
    });
  };

  ipamAPI.prototype.queueRequest = function(r) {
    var self = this;
    // Note: Some poor mans resource management...
    if (self.openRequests.length > 0) {
      for (var i = self.openRequests.length - 1; i--;) {
        if (!(self.openRequests[i].isPending()))
          self.openRequests.splice(i, 1);
      }
    }
    self.openRequests.push(r);
  };

  ipamAPI.prototype.injectLock = function() {
    var self = this;
    // var lock = new Promise(function(resolve, reject, cancel) {});
    var lock = new Promise(function() {});
    self.queueRequest(lock);
    return lock;
  };

  ipamAPI.prototype.logout = function(s) { // API logout
    var self = this;
    if (!self.session) {
      if (s) return; // we are logging out via process@beforeExit
      return Promise.reject(new Error('Unable to logout from ' +
        self.options.base + ' [Invalid login session]'));
    }
    return self.session.then(function() {
      // Note: Logout only until all outstanding requests are done.
      //       http://bluebirdjs.com/docs/api/reflect.html
      return Promise.all(self.openRequests.map(function(p) {
          return p.reflect();
        }))
        .then(function() {
          return self.reqProm(self.reqOpts('/user/', {
              method: 'DELETE'
            },
            self.token.token)).then(function() {
            console.log(self.token.token + ': Logged out.');
            self.init();
          });
        });
    });
  };

  ipamAPI.prototype.fetchNet = function(cidr) {
    var self = this;
    if (!self.session)
      return Promise.reject(new Error('Unable to fetch from ' +
        self.options.base + ' [Invalid login session]'));

    return self.session.then(function() {
      var lock = self.injectLock();
      return self.request('/subnets/cidr/' + cidr).then(function(r) {
          if (r.data.length !== 1) { /* error ? */ }
          var d = deepExtend({}, r.data[0]);
          var n = Promise.resolve(d);
          // We dont propagate errors, here...
          var s = self.request('/subnets/' + d.id + '/slaves/');
          var m = self.request('/subnets/' + d.masterSubnetId + '/');
          var v = self.request('/vlans/' + d.vlanId + '/');
          return Promise.all([n, s, m, v].map(function(p) {
            return p.reflect();
          }));
        })
        .map(function(p) {
          return p.isFulfilled() ? p.value() : null;
        })
        .spread(function(n, s, m, v) {
          return deepExtend({}, n,
            { numSlaves: s ? s.data.length : 0 },
            { masterSubnet: m ? m.data : null },
            { vlan: v ? v.data : null });
        })
        .finally(function() {
          lock.cancel();
        });
    });
  };

  ipamAPI.prototype.fetchNets = function() {
    var self = this;
    if (!self.session)
      return Promise.reject(new Error('Unable to fetch from ' +
        self.options.base + ' [Invalid login session]'));

    return self.session.then(function() {
      var lock = self.injectLock();
      return self.request('/sections/').then(function(r) {
          return _.pluck(r.data, 'id');
        })
        .map(function(i) {
          // We dont propagate errors, here...
          return self.request('/sections/' + i + '/subnets/')
            .catch(function() {});
        })
        .map(function(p) {
          return (p && (p.success && p.data)) ? p.data : null;
        })
        .then(function(r) {
          var x = {};
          _.chain(r).compact().flatten().each(function(e) {
            if (e.subnet && e.mask) {
              var k = e.subnet + '/' + e.mask;
              if (x[k]) {
                if (_.findWhere(x[k], {id: e.id})) /* Review: Ooops */;
                else x[k].push(e);
              } else { x[k] = []; x[k].push(e); }
            }
          });
          return x;
        })
        .finally(function() {
          lock.cancel();
        });
    });
  };

  ipamAPI.prototype.fetchVlans = function() {
    var self = this;
    if (!self.session)
      return Promise.reject(new Error('Unable to fetch from ' +
        self.options.base + ' [Invalid login session]'));

    return self.session.then(function() {
      var lock = self.injectLock();
      return self.request('/l2domains/').then(function(r) {
          return _.pluck(r.data, 'id');
        })
        .map(function(i) {
          // We dont propagate errors, here...
          return self.request('/l2domains/' + i + '/vlans/')
            .catch(function() {});
        })
        .map(function(p) {
          return (p && (p.success && p.data)) ? p.data : null;
        })
        .then(function(r) {
          var x = {};
          _.chain(r).compact().flatten().each(function(e) {
            if (x[e.number]) {
              if (_.findWhere(x[e.number], {id: e.id})) /* Review: Ooops */;
              else x[e.number].push(e);
            } else { x[e.number] = []; x[e.number].push(e); }
          });
          return x;
        })
        .finally(function() {
          lock.cancel();
        });
    });
  };

};
