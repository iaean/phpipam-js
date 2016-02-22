'use strict';

// Nodeback compatible wrapper for request callback(error, request, body)
module.exports = function(o, cb) {
  var request = require('request');
  request(o, function(e, r, data) {
    if (e) cb(e);
    else {
      if (r.statusCode < 200 || r.statusCode > 299) {
        if (data.message)
          cb(new Error('HTTP statusCode ' + r.statusCode + ' != 2xx (' +
            data.message + ')'));
        else cb(new Error('HTTP statusCode ' + r.statusCode + ' != 2xx'));
      } else cb(null, data);
    }
  });
};
