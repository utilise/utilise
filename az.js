var key = require('utilise/key')

module.exports = function az(k) {
  return function(a, b){
    return key(k)(a) > key(k)(b) ?  1 
         : key(k)(a) < key(k)(b) ? -1 
                                 :  0
  }
}
