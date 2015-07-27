module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}