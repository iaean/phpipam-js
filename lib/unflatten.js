'use strict';

var _ = require('underscore');

function unflatten(array, parent, tree) {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { id: 0 };
  // jshint -W116
  var children = _.filter(array, function(child) {
    return child.masterSubnetId == parent.id; });
  if (!_.isEmpty(children)) {
    if (parent.id == 0) tree = children;
    else parent['subnets'] = children; // jscs:ignore requireDotNotation
    _.each(children, function(child) {
      unflatten(array, child);
    });
  }
  // jshint +W116
  return tree;
}

module.exports = unflatten;
