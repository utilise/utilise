var set = require('utilise/set')
  
module.exports = function update(key, value){
  return function(o){
    return set({ key: key, value: value, type: 'update' })(o)
  }
}