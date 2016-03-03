var last = require('utilise/last')
  , set = require('utilise/set')
  , is = require('utilise/is')

module.exports = function pop(o){
  return is.arr(o) 
       ? set({ key: o.length - 1, value: last(o), type: 'remove' })(o)
       : o 
}