var key = require('./key')

module.exports = function az(k) {
  return function(a, b){
    var ka = key(k)(a) || ''
      , kb = key(k)(b) || ''

    return ka > kb ?  1 
         : ka < kb ? -1 
                   :  0
  }
}
