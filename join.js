var clone = require('utilise/clone')
  , key = require('utilise/key')
  , by = require('utilise/by')

module.exports = function join(left, right){
  return function(d){
    var array = right.split('.')
      , table = array.shift()
      , field = array.join('.')

    d[left] = ripple(table)
      .filter(by('id', clone(d[left])))
      .map(key(field))
      .pop() || {}

    return d
  }
}
