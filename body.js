module.exports = function body(ripple){
  return function(name){
    var res = ripple.resources[name]
    return res && res.body
  }
}