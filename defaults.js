var extend = require('utilise/extend')

module.exports = function defaults(el, opts){
  return el.state = extend(extend(el.__data__ || {})(el.state || {}))(opts || {})
}