var set = require('utilise/set')
  , key = require('utilise/key')
  
module.exports = function remove(k){
  return function(o){
    return set({ key: k, value: key(k)(o), type: 'remove' })(o)
  }
}