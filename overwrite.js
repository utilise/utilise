var is = require('utilise/is')
  , keys = require('utilise/keys')
  , copy = require('utilise/copy')

module.exports = function overwrite(to){ 
  return function(from){
    keys(from)
      .map(copy(from, to))
        
    return to
  }
}