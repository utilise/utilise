module.exports = function nullify(fn){
  return function(){
    return fn.apply(this, arguments) ? true : null
  }
}