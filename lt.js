var key = require('utilise/key')

module.exports = function lt(k, v){
  return function(d){
    return key(k)(d) < v
  }
}
