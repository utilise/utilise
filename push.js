module.exports = function push(arr){
  return function(d){
    return arr.push(d), arr
  }
}
