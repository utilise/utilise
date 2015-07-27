module.exports = function includes(pattern){
  return function(d){
    return ~d.indexOf(pattern)
  }
}