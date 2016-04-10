var has = require('utilise/has')

module.exports = function def(o, p, v, w, c){
  Object.defineProperty(o, p, { value: v, writable: w, configurable: c })
  return o[p]
}
