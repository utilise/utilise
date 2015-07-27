var wrap = require('utilise/wrap')

module.exports = function inherit(l) {
  if (arguments.length > 1) return [l]

  return function(d) {
    return new Array((l||1)+1)
      .join('0')
      .split('')
      .map(wrap(d))
  }
}