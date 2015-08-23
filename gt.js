var key = require('utilise/key')

module.exports = function gt(k, v){
  return function(d){
    return key(k)(d) > v
  }
}
