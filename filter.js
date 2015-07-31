module.exports = function filter(fn){
  return function(arr){
    return arr.filter(fn)
  }
}
