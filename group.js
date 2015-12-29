var client = require('utilise/client')
  , owner = require('utilise/owner')
  , noop = require('utilise/noop')

module.exports = function group(prefix, fn){
  if (!owner.console) return fn()
  if (!console.groupCollapsed) polyfill()
  console.groupCollapsed(prefix)
  var ret = fn()
  console.groupEnd(prefix)
  return ret
}

function polyfill() {
  console.groupCollapsed = console.groupEnd = function(d){
    (console.log || noop)('*****', d, '*****')
  }
}