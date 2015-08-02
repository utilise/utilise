var identity = require('utilise/identity')
  , wrap = require('utilise/wrap')
  , is = require('utilise/is')

module.exports = function inherit(thing) {
  if (arguments.length > 1) return [thing]
  var len = is.num(thing) ? thing : 1
    , fn = is.fn(thing) ? thing : identity

  return function(d) {
    return new Array(len + 1)
      .join('0')
      .split('')
      .map(wrap(fn(d)))
  }
}